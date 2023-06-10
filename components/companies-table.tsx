import {Animated, Modal, RefreshControl, StyleSheet, Text, View} from 'react-native';

import {DataTable, MD3Colors, ProgressBar, Searchbar} from "react-native-paper";
import React, {useEffect} from "react";
import ScrollView = Animated.ScrollView;

export interface Company {
    id: string,
    name: string;
    location: string,
}

export default function CompaniesTable() {
    const [selection, setSelection] = React.useState<Company>()
    const [companies, setAssignments] = React.useState<Company[]>([])
    const [sortDescending, setSortDescending] = React.useState(true)
    const [modalVisible, setModalVisible] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)
    const [query, setQuery] = React.useState<string>("")

    const showModal = () => setModalVisible(true)
    const hideModal = () => setModalVisible(false)
    const toggleSort = () => setSortDescending(!sortDescending)
    const sortDirection = () => sortDescending ? 'descending' : 'ascending'

    const onSelectRow = (company: Company) => {
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
                    <DataTable.Title style={styles.halfCell} sortDirection={sortDirection()} onPress={toggleSort}>
                        <Text style={styles.header}>Name</Text>
                    </DataTable.Title>
                    <DataTable.Title style={styles.halfCell}>
                        <Text style={styles.header}>Location</Text>
                    </DataTable.Title>
                </DataTable.Header>

                {filteredAndSorted(companies)
                    .map(company =>
                        <View>
                            <DataTable.Row key={company.id} onPress={() => onSelectRow(company)}>
                                <DataTable.Cell style={styles.halfCell}>{company.name}</DataTable.Cell>
                                <DataTable.Cell style={styles.halfCell}>{company.location}</DataTable.Cell>
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

    function filteredAndSorted(company: Company[]): Company[] {
        const sorted = company
            .filter(it => containsQuery(it))
            .sort((a, b) => a.name.localeCompare(b.name));
        return sortDescending ? sorted : sorted.reverse()
    }

    function containsQuery(company: Company): boolean {
        let queryTarget = Object.values(company)
        return queryTarget
            .filter(it => it.toString().toLowerCase().includes(query.toLowerCase()))
            .length != 0
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

const data: Company[] = [
    {id: "1", name: "Mijn B.V.", location: "Zoetermeer"},
]