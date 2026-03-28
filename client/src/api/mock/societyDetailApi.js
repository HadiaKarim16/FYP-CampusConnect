import { mockStorage } from './mockStorage';

export const societyDetailApi = {
  getById: async (societyId) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const details = mockStorage.get('societyDetails') || {};
    const society = details[societyId];
    
    if (!society) {
      throw new Error('Society not found');
    }

    const memberships = mockStorage.get('userMemberships') || {};
    const membershipStatus = memberships[societyId] || null;

    return { ...society, membershipStatus };
  }
};
