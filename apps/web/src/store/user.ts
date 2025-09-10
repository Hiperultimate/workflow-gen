import { create } from "zustand";

type IUser = {
  email: string;
};

interface IUserStore {
  user: IUser | null;
  updateUserSession: (userDetails: IUser | null) => void;
}

export const useUserSession = create<IUserStore>((set) => ({
  // initialize empty user (assert type)
  user: null,

//   userCredentials: [],
//   userWorkflows: [],

  updateUserSession: (userData: IUser | null) => {
    if (userData === null) {
      set(() => ({
        user: null,
      }));
    } else {
      set((state) => ({
        user: {
          ...state.user,
          ...userData,
        },
      }));
    }
  },
}));
