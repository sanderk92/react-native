import {Animated, Image, StyleSheet} from 'react-native';

import {Button, Card, IconButton, Text, useTheme} from "react-native-paper";
import React from "react";
import ScrollView = Animated.ScrollView;
import {ThemeProvider} from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CompaniesTable from "../../components/companies-table";
import PartnersTable from "../../components/partners-table";

export default function PartnersScreen() {
    const theme = useTheme();

    return (
        <PartnersTable/>
    );
}

const styles = StyleSheet.create({
    container: {
        // width: "100%",
        backgroundColor: "#f4f6fa",
    },
    card: {
        // marginBottom: 10,
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: "black",
        backgroundColor: '#485f7a',
    },
    image: {
        maxHeight: 90,
        maxWidth: 90

    }
})