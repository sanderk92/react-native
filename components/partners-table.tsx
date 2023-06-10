import {Animated, Modal, RefreshControl, StyleSheet, Text, View} from 'react-native';

import {DataTable, MD3Colors, ProgressBar, Searchbar} from "react-native-paper";
import React, {useEffect} from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {v4 as uuid} from "uuid";
import ScrollView = Animated.ScrollView;

export interface Partner {
    id: string
    name: string
    verified: boolean
    location: string
}

export default function PartnersTable() {
    const [selection, setSelection] = React.useState<Partner>()
    const [partners, setAssignments] = React.useState<Partner[]>([])
    const [sortDescending, setSortDescending] = React.useState(true)
    const [modalVisible, setModalVisible] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)
    const [query, setQuery] = React.useState<string>("")

    const showModal = () => setModalVisible(true)
    const hideModal = () => setModalVisible(false)
    const toggleSort = () => setSortDescending(!sortDescending)
    const sortDirection = () => sortDescending ? 'descending' : 'ascending'

    const onSelectRow = (company: Partner) => {
        setSelection(company)
        showModal()
    }

    useEffect(() => {
        fetchData()
    }, [])

    const onRefresh = React.useCallback(() => {
        fetchData()
    }, []);


    return <View style={styles.container}>
        <ScrollView refreshControl={
            <RefreshControl
                refreshing={false}
                onRefresh={onRefresh}
            />
        }>
            <DataTable>
                <DataTable.Header style={styles.top}>
                    <DataTable.Title style={styles.thirdCell} sortDirection={sortDirection()} onPress={toggleSort}>
                        <Text style={styles.header}>Name</Text>
                    </DataTable.Title>
                    <DataTable.Title style={styles.thirdCell}>
                        <Text style={styles.header}>Location</Text>
                    </DataTable.Title>
                    <DataTable.Title style={styles.thirdCell}>
                        {/*<Text style={styles.header}>Status</Text>*/}
                    </DataTable.Title>
                </DataTable.Header>

                {filteredAndSorted(partners)
                    .map(partner =>
                        <View>
                            <DataTable.Row key={partner.id} onPress={() => onSelectRow(partner)}>
                                <DataTable.Cell style={styles.thirdCell}>{partner.name}</DataTable.Cell>
                                <DataTable.Cell style={styles.thirdCell}>{partner.location}</DataTable.Cell>
                                <DataTable.Cell style={styles.thirdCell} numeric>{indicator(partner)}</DataTable.Cell>
                            </DataTable.Row>
                        </View>
                    )}
            </DataTable>
        </ScrollView>

        <Modal visible={modalVisible} onRequestClose={hideModal}>
            <Text>{selection?.id}</Text>
            <Text>{selection?.name?.toString()}</Text>
        </Modal>

        <ProgressBar
            visible={isLoading}
            progress={1}
            color={MD3Colors.neutral0}
            indeterminate={true}
        />

        <Searchbar
            style={styles.search}
            placeholder="Search"
            onChangeText={text => setQuery(text)} value={query}
        />
    </View>;

    function filteredAndSorted(company: Partner[]): Partner[] {
        const sorted = company
            .filter(it => containsQuery(it))
            .sort((a, b) => a.name.localeCompare(b.name));
        return sortDescending ? sorted : sorted.reverse()
    }

    function containsQuery(company: Partner): boolean {
        let queryTarget = Object.values(company)
        return queryTarget
            .filter(it => it.toString().toLowerCase().includes(query.toLowerCase()))
            .length != 0
    }

    function indicator(partner: Partner) {
        if (partner.verified) {
            return <FontAwesome key={uuid()} name="check" size={15} color={'green'}/>
        } else {
            return <FontAwesome key={uuid()} name="times" size={15} color={'red'}/>
        }
    }

    function fetchData() {
        setAssignments([])
        setIsLoading(true);
        setTimeout(() => {
            setAssignments(data)
            setIsLoading(false);
        }, 2000);
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        backgroundColor: "#f4f6fa",
    },
    top: {
        backgroundColor: '#485f7a',
    },
    header: {
        fontSize: 15,
        color: 'white',
    },
    dateRow: {
        backgroundColor: "#dde1ee",
        borderBottomWidth: 1,
        minHeight: 15,
    },
    row: {
        backgroundColor: '#f5f6f8',
        borderBottomWidth: 1,
        minHeight: 75,
    },
    tenthCell: {
        maxWidth: "10%"
    },
    halfCell: {
        maxWidth: "50%"
    },
    quarterCell: {
        maxWidth: "25%",
    },
    thirdCell: {
        maxWidth: "33%"
    },
    search: {
        backgroundColor: '#ffffff',
        borderRadius: 0,
        borderTopWidth: 0.25,
        borderBottomWidth: 0.25,
    },
    dialog: {
        backgroundColor: 'white'
    },
    cancelButton: {
        color: 'red'
    },
    doneButton: {
        color: 'green'
    },
    snackbarText: {
        color: 'white'
    },
});

const data: Partner[] = [
    {id: "1", name: "Glazen bol NL", location: "Zoetermeer", verified: true},
    {id: "2", name: "Picobello B.V.", location: "Alphen", verified: true},
    {id: "3", name: "NooitTeLaat", location: "Ter Aar", verified: true},
    {id: "4", name: "Rapidos", location: "Rotterdam", verified: true},
    {id: "5", name: "America b.v.", location: "Woerden", verified: true},
]