// libraries
import { computed } from 'vue';

// stores
import { useAdminOrganisationStore } from 'src/stores/adminOrganisation';

// types
import type { Ref } from 'vue';
import type {
  AdminSubsidiary,
  AdminTeam,
  AdminTeamMember,
} from 'src/components/types/AdminOrganisation';
import type {
  InvoicePayment,
  InvoiceTeamMember,
  InvoiceTeam,
} from 'src/components/types/Invoice';

/**
 * Transforms invoice payment and team member data to team structure
 * @param {InvoicePayment} payment - Payment from invoice
 * @param {AdminTeamMember} member - Team member from organization
 * @param {AdminTeam} team - Team information
 * @returns {InvoiceTeamMember} - Formatted member for invoice
 */
function transformPaymentToMember(
  payment: InvoicePayment,
  member: AdminTeamMember,
  team: AdminTeam,
): InvoiceTeamMember {
  return {
    id: String(member.user_profile_id),
    name: member.name,
    teamId: String(team.id),
    payment: {
      amount: payment.amount,
    },
  };
}

/**
 * Build teams data for invoice creation form
 * Matches payments_to_invoice with team members by userprofile_id
 * @returns {Ref<InvoiceTeam[]>} - Array of teams with members that have payments to invoice
 */
export const useInvoiceTeamsData = (): {
  invoiceTeamsData: Ref<InvoiceTeam[]>;
} => {
  const adminOrganisationStore = useAdminOrganisationStore();

  const invoiceTeamsData = computed<InvoiceTeam[]>(() => {
    const organisation = adminOrganisationStore.getCurrentAdminOrganisation;
    const invoiceResult = adminOrganisationStore.getCurrentAdminInvoice;

    if (
      !organisation ||
      !organisation.subsidiaries ||
      !invoiceResult ||
      !invoiceResult.payments_to_invoice
    ) {
      return [];
    }

    const paymentsToInvoice = invoiceResult.payments_to_invoice;
    const teamsMap = new Map<number, InvoiceTeam>();

    // Loop through all subsidiaries and teams to build a member lookup
    const memberLookup = new Map<
      number,
      { member: AdminTeamMember; team: AdminTeam }
    >();

    organisation.subsidiaries.forEach((subsidiary: AdminSubsidiary) => {
      if (!subsidiary.teams) {
        return;
      }
      subsidiary.teams.forEach((team: AdminTeam) => {
        // Check all member arrays for potential matches
        const allMembers = [
          ...team.members_without_paid_entry_fee_by_org_coord,
          ...team.members_with_paid_entry_fee_by_org_coord,
          ...team.other_members,
        ];

        allMembers.forEach((member: AdminTeamMember) => {
          memberLookup.set(member.user_profile_id, { member, team });
        });
      });
    });

    // Match payments with members and group by team
    paymentsToInvoice.forEach((payment: InvoicePayment) => {
      const memberData = memberLookup.get(payment.userprofile_id);

      if (memberData) {
        const { member, team } = memberData;
        // Create or get existing team
        if (!teamsMap.has(team.id)) {
          teamsMap.set(team.id, {
            id: String(team.id),
            name: team.name,
            members: [],
          });
        }

        const invoiceTeam = teamsMap.get(team.id)!;
        const transformedMember = transformPaymentToMember(
          payment,
          member,
          team,
        );

        invoiceTeam.members.push(transformedMember);
      }
    });

    return Array.from(teamsMap.values());
  });

  return {
    invoiceTeamsData,
  };
};
