import { Notify } from 'quasar';
import { api } from '../boot/axios';
import { i18n } from '../boot/i18n';

interface ApiResponse<T> {
  data: T | null;
}

export const useApiPost = () => {
  const apiPost = async <T>({
    endpoint,
    payload,
    translationKey,
  }: {
    endpoint: string;
    payload: unknown;
    translationKey: string;
  }): Promise<ApiResponse<T>> => {
    try {
      const response = await api.post<T>(endpoint, payload);

      if (response.status >= 200 && response.status < 300) {
        Notify.create({
          message: i18n.global.t(`${translationKey}.apiMessageSuccess`),
          color: 'positive',
        });
        return { data: response.data };
      } else {
        Notify.create({
          message: i18n.global.t(`${translationKey}.apiMessageError`, {
            status: response.status,
          }),
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

  return { apiPost };
};
