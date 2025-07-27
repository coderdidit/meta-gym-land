// Simple user interface to replace Moralis.User
export interface SimpleUser {
  id: string;
  attributes: {
    [key: string]: any;
  };
  get: (key: string) => any;
  set: (key: string, value: any) => void;
  increment: (key: string, value: number) => void;
  save: () => Promise<void>;
  fetch: () => Promise<SimpleUser>;
}

// Create a mock user for demo purposes
export const createMockUser = (): SimpleUser => {
  const attributes: { [key: string]: any } = {
    xp: 0,
    current_level: 1,
    completed_minigames: [],
    total_time_in_minigames: 0,
    gym_buddy_mage_minted: false,
  };

  return {
    id: "mock-user-id",
    attributes,
    get: (key: string) => attributes[key],
    set: (key: string, value: any) => {
      attributes[key] = value;
    },
    increment: (key: string, value: number) => {
      attributes[key] = (attributes[key] || 0) + value;
    },
    save: async () => {
      // Mock save - could be replaced with localStorage or API call
      console.log("Mock user save:", attributes);
    },
    fetch: async () => {
      // Mock fetch - could be replaced with API call
      return createMockUser();
    },
  };
};
