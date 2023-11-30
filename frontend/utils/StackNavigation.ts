import { StackNavigationProp } from "@react-navigation/stack"
import { Dispatch, SetStateAction, RefObject, MutableRefObject, SyntheticEvent } from "react"

export type RootStackParamList = {
    GetStartedPage: undefined
    Login: undefined
    Home: undefined
}

type GetStartedPageNavigationProp = StackNavigationProp<RootStackParamList, "GetStartedPage">

export type GetStartedPageProps = {
    navigation: GetStartedPageNavigationProp
    setState?: Dispatch<SetStateAction<"LoginPage" | "RegisterPage">>
    checklogin?: () => void
}
