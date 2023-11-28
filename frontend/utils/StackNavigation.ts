import { StackNavigationProp } from "@react-navigation/stack"

export type RootStackParamList = {
    GetStartedPage: undefined
    Login: undefined
    Home: undefined
}

type GetStartedPageNavigationProp = StackNavigationProp<
    RootStackParamList,
    "GetStartedPage",
    "Login"
>

export type GetStartedPageProps = {
    navigation: GetStartedPageNavigationProp
}
