// libraries
import { Notify } from 'quasar';
import { api } from '../boot/axios';
import { i18n } from '../boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';
const { apiVersion } = rideToWorkByBikeConfig;

// types
import type { Method } from 'axios';

interface ApiResponse<T> {
  data: T | null;
}

export const useApi = () => {
  const apiFetch = async <T>({
    endpoint,
    payload,
    translationKey,
    method = 'get',
    acceptHeader = `application/json; version=${apiVersion}`,
  }: {
    endpoint: string;
    payload: unknown;
    translationKey: string;
    method: Method;
    acceptHeader?: string;
  }): Promise<ApiResponse<T>> => {
    try {
      const response = await api<T>({
        url: endpoint,
        method: method,
        data: payload,
        headers: {
          Accept: acceptHeader,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        Notify.create({
          message: i18n.global.t(`${translationKey}.apiMessageSuccess`),
          color: 'positive',
        });
        return { data: response.data };
      } else {
        Notify.create({
          message: i18n.global.t(`${translationKey}.apiMessageError`),
          color: 'negative',
        });
        return { data: null };
      }
    } catch (e) {
      console.error(e);
      Notify.create({
        message: i18n.global.t(`${translationKey}.apiMessageError`),
        color: 'negative',
      });
      return { data: null };
    }
  };

  return { apiFetch };
};
