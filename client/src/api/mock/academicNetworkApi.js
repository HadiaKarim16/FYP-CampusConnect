import { mockStorage } from './mockStorage';

export const academicNetworkApi = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return mockStorage.get('academicProfiles') || [];
  },

  sendConnectionRequest: async (profileId) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    mockStorage.update('academicProfiles', profiles =>
      (profiles || []).map(p =>
        p.id === profileId ? { ...p, connectionStatus: 'pending' } : p
      )
    );
    return { success: true, profileId };
  },

  acceptConnection: async (profileId) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    mockStorage.update('academicProfiles', profiles =>
      (profiles || []).map(p =>
        p.id === profileId ? { ...p, connectionStatus: 'connected' } : p
      )
    );
    return { success: true, profileId };
  }
};
