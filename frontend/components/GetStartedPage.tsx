import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { APIENDPOINT } from "@env"
import OnBoardBG1 from "../assets/OnBoardBG1.png"
import OnBoardBG2 from "../assets/OnBoardBG2.png"
import OnBoardBG3 from "../assets/OnBoardBG3.png"
import { ImageBackground } from "react-native"
import Swiper from "react-native-swiper"
import { GetStartedPageProps } from "@/utils/StackNavigation"

export default function GetStartedPage({ navigation }: GetStartedPageProps) {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [result, setReslut] = useState<string>("")
    const getResult = async () => {
        if (APIENDPOINT)
            try {
                const response = await fetch(APIENDPOINT)

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data: { success: string } = await response.json()

                setReslut(`connected backend ${data.success}`)
            } catch (error) {}
    }

    useEffect(() => {
        getResult()
    }, [])

    return (
        <Swiper
            style={styles.wrapper}
            showsButtons={false}
            loop={true}
            autoplay={true}
            autoplayTimeout={5}
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
            paginationStyle={styles.paginationStyle}
        >
            <ImageBackground source={OnBoardBG1} style={styles.slide}>
                <Text style={styles.Introtext}>
                    Influencers can effortlessly find an partner with brands
                </Text>
                <Text style={styles.explaintext}>
                    Navigate tailored agreements that will amplify influencers impact on their
                    network, unlocking exclusive opportunities from our exclusive realm of digital
                    partnerships.
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.buttonText}>Get started</Text>
                </TouchableOpacity>
            </ImageBackground>
            <ImageBackground source={OnBoardBG2} style={styles.slide}>
                <Text style={styles.Introtext}>Brands get exactly what they are pay for</Text>
                <Text style={styles.explaintext}>
                    Simplifying influencer marketing agreements means making clear expectations. We
                    help validate influencers impressions and metrics so that brands can create
                    specific goals for their campaigns.
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.buttonText}>Get started</Text>
                </TouchableOpacity>
            </ImageBackground>
            <ImageBackground source={OnBoardBG3} style={styles.slide}>
                <Text style={styles.Introtext}>
                    Intuitive tools to unlock new marketing channels
                </Text>
                <Text style={styles.explaintext}>
                    With HAHA’s tools, you can ensuring not just efficient collaboration but also a
                    cleverly customized experience, making every partnership an energizing step
                    towards success in the influencer landscape.{" "}
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.buttonText}>Get started</Text>
                </TouchableOpacity>
            </ImageBackground>
        </Swiper>
    )
}

const styles = StyleSheet.create({
    wrapper: {},
    paginationStyle: {
        position: "absolute",
        justifyContent: "flex-start",
        left: 24,
        bottom: 96,
    },
    dot: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#14161B",
        width: 12,
        height: 12,
        borderRadius: 12,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },

    activeDot: {
        backgroundColor: "#0FF",
        borderWidth: 1,
        borderColor: "#14161B",
        width: 12,
        height: 12,
        borderRadius: 12,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },
    slide: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingTop: "110%",
        paddingLeft: 24,
        paddingHorizontal: 30,
    },
    Introtext: {
        color: "#14161B",
        height: 115,
        width: "90%",
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "left",
        marginBottom: 16,
    },
    explaintext: {
        color: "#545760",
        width: "90%",
        fontSize: 14,
        fontWeight: "500",
        textAlign: "left",
    },
    button: {
        position: "absolute",
        justifyContent: "flex-end",
        right: 24,
        bottom: 80,
        backgroundColor: "#0FF",
        borderRadius: 40,
        paddingVertical: 8,
        paddingHorizontal: 24,
        alignItems: "center",
        marginTop: 20,
    },

    buttonText: {
        color: "#14161B",
        fontSize: 18,
        fontWeight: "600",
        lineHeight: 32,
    },
})
