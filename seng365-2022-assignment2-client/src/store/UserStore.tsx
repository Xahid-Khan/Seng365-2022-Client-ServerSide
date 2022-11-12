// import create from "zustand";
//
//
// interface UserState {
//     user : UserSelf,
//     setUser: (user: UserSelf) => void,
//     editUser: (user: UserSelf) => void,
//     removeUser: (user: UserSelf) => void,
// }
//
// interface UserPhoto {
//     userPhoto : string,
// }
//
// interface UserAuthentication {
//     token : "",
//     userId : number,
// }
//
// const useUserState = create<UserState>((set) => ({
//     user: (window.localStorage.getItem("user") !== null ? window.localStorage.getItem("user") : {firstName:"", lastName:"", email:""}),
//     setUser: (user: UserSelf) => set(() => {
//         return {user: user}
//     }),
//     editUser: (newUser : UserSelf) => set((state) => {
//         return {user: newUser}
//     }),
//     removeUser: () => set((state) => {
//         return {user: {firstName:"", lastName:"", email:""}}
//     })
// }))
//
// export {
//     useUserState,
//
// };


const UserStore = () => {
    return (
        <div>
            Hello...
        </div>
    );
}

export default UserStore;