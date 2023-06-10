import {Animated, StyleSheet} from 'react-native';

import {Button, Card, Text} from "react-native-paper";
import React from "react";
import ScrollView = Animated.ScrollView;
import CompaniesTable from "../../components/companies-table";

export default function CompaniesScreen() {
    return (
        <CompaniesTable></CompaniesTable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#f4f6fa",
    },
    card: {
        marginBottom: 10
    }
})