import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";
//atom에 저장된 정보를 loaclStorage를 이용해서 저장
const { persistAtom } = recoilPersist();
//atom() : 데이터(state형태)를 저장 하는 함수
// -> 필요한 컴포넌트에서 useRecoilState()라는 훅을 사용하면 꺼내서 사용할 수 있음 : 리턴이 state 형태
//selector() : 존재하는 데이터를 이용해서 함수에서 데이터를 편집해서 리턴할 수 있음

//외부에서 데이터를 저장하거나 또는 사용하고싶으면 atom
//외부에서 특정데이터를 통한 연산결과를 도출하고 싶으면 selector

//로그인한 회원의 아이디를 저장하는 저장소(atom)
const loginNickState = atom({
  key: "loginNickState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});
//로그인한 회원의 타입을 저장하는 저장소(atom)
const memberTypeState = atom({
  key: "memberTypeState",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});
//selector : atom 으로 생성한 데이터를 이용해서 함수를 실행하고 결과를 리턴
const isLoginState = selector({
  key: "isLoginState",
  get: (state) => {
    //매개변수 state는 recoil에 저장된 데이터를 불러오기 위한 객체
    const loginNick = state.get(loginNickState);
    return loginNick !== "";
  },
});
const isPlannerState = atom({
  key: "plannerState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export { loginNickState, memberTypeState, isLoginState, isPlannerState };
