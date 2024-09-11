describe('Login Functionality', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.dataCy('form-login').should('be.visible');
    cy.dataCy('form-login-email').should('be.visible');
    cy.dataCy('form-login-password').should('be.visible');
    cy.dataCy('form-login-submit-login').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.dataCy('form-login-email').type('invalid@example.com');
    cy.dataCy('form-login-password').type('wrongpassword');
    cy.dataCy('form-login-submit-login').click();

    // Check for error notification
    cy.get('.q-notification').should('contain', 'Invalid credentials');
  });

  it('should successfully log in with valid credentials', () => {
    // Intercept the API call
    cy.intercept('POST', '**/api/login').as('loginRequest');

    cy.dataCy('form-login-email').type('valid@example.com');
    cy.dataCy('form-login-password').type('correctpassword');
    cy.dataCy('form-login-submit-login').click();

    // Wait for the API call to complete
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // Check for success notification
    cy.get('.q-notification').should('contain', 'Login successful');

    // Verify redirection to dashboard or home page
    cy.url().should('include', '/dashboard');
  });

  it('should persist login state after page reload', () => {
    // Log in first (you might want to use a custom command for this)
    // ...

    // Reload the page
    cy.reload();

    // Verify that the user is still logged in
    cy.url().should('include', '/dashboard');
  });
});
