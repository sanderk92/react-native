import {Text, View, Animated, Modal, RefreshControl, StyleSheet, useColorScheme} from 'react-native';

import {DataTable, ProgressBar, Searchbar, MD3Colors} from "react-native-paper";
import React, {useEffect} from "react";
import { v4 as uuid } from 'uuid';
import ScrollView = Animated.ScrollView;
import FontAwesome from "@expo/vector-icons/FontAwesome";

export interface Assignment {
    id: string,
    time: Date;
    status: string;
    type: string;
    title: string;
    message: string;
}

export default function AssignmentsTable() {
    const [selection, setSelection] = React.useState<Assignment>()
    const [assignments, setAssignments] = React.useState<Assignment[]>([])
    const [sortDescending, setSortDescending] = React.useState(true)
    const [modalVisible, setModalVisible] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)
    const [query, setQuery] = React.useState<string>("")

    const showModal = () => setModalVisible(true)
    const hideModal = () => setModalVisible(false)
    const toggleSort = () => setSortDescending(!sortDescending)
    const sortDirection = () => sortDescending ? 'descending' : 'ascending'

    const onSelectRow = (assignment: Assignment) => {
        setSelection(assignment)
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
                    <DataTable.Title style={styles.quarterCell} sortDirection={sortDirection()} onPress={toggleSort}>
                        <Text style={styles.header}>Time</Text>
                    </DataTable.Title>
                    <DataTable.Title style={styles.halfCell}>
                        <Text style={styles.header}>Title</Text>
                    </DataTable.Title>
                </DataTable.Header>

                {Array.from(groupedByDay(filteredAndSorted(assignments)))
                    .map(entries =>
                        <View>
                            <DataTable.Row key={uuid()} style={styles.dateRow}>
                                <DataTable.Cell>{dateString(entries[0])}</DataTable.Cell>
                            </DataTable.Row>
                            {entries[1].map(entry =>
                                <DataTable.Row key={entry.id} onPress={() => onSelectRow(entry)}>
                                    <DataTable.Cell style={styles.quarterCell}>{timeString(entry.time)}</DataTable.Cell>
                                    <DataTable.Cell style={styles.halfCell}>{entry.title}</DataTable.Cell>
                                    <DataTable.Cell numeric>{indicator(entry)}</DataTable.Cell>
                                </DataTable.Row>
                            )}
                        </View>
                    )}
            </DataTable>
        </ScrollView>

        <Modal visible={modalVisible} onRequestClose={hideModal}>
            <Text>{selection?.id}</Text>
            <Text>{selection?.time?.toString()}</Text>
            <Text>{selection?.status}</Text>
            <Text>{selection?.type}</Text>
            <Text>{selection?.title}</Text>
            <Text>{selection?.message}</Text>
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

    function filteredAndSorted(assignments: Assignment[]): Assignment[] {
        return assignments
            .filter(it => containsQuery(it))
            .sort((a, b) => {
                return sortDescending ? b.time.getTime() - a.time.getTime() : a.time.getTime() - b.time.getTime();
            })
    }

    function containsQuery(assignment: Assignment): boolean {
        let queryTarget = Object.values(assignment)
        queryTarget.push(dateString(assignment.time.getTime()))
        return queryTarget
            .filter(it => it.toString().toLowerCase().includes(query.toLowerCase()))
            .length != 0
    }

    function groupedByDay(assignment: Assignment[]): Map<number, Assignment[]> {
        let dict = new Map<number, Assignment[]>()
        assignment.forEach(entry => {
            let date = new Date(entry.time)
            date.setHours(0, 0, 0, 0)
            let key = date.getTime()

            let value = dict.get(key) || []
            value.push(entry)
            dict.set(key, value)
        })
        return dict
    }

    function dateString(epochMs: number): string {
        let date = new Date(epochMs)
        let year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
        let month = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(date);
        let day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date);
        return `${year}-${month}-${day}`;
    }

    function timeString(date: Date) {
        return date.toLocaleTimeString()
    }

    function indicator(assignment: Assignment) {
        if (assignment.status == "new") {
            return <FontAwesome key={uuid()} name="envelope-o" size={15} color={'brown'}/>
        } else if (assignment.status == "declined") {
            return <FontAwesome key={uuid()} name="times" size={15} color={'red'}/>
        } else if (assignment.status == "finished") {
            return <FontAwesome key={uuid()} name="check" size={15} color={'green'}/>
        } else {
            return <FontAwesome key={uuid()} name="clock-o" size={15} color={'blue'}/>
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

const data: Assignment[] = [
    {id: "1", time: new Date(2023, 6, 2), status: "new", type: "delivery", title: "Koopmans", message: "snel!"},
    {id: "2", time: new Date(2023, 6, 2, 14), status: "accepted", type: "delivery", title: "Picobello B.V.", message: "casc!",},
    {id: "3", time: new Date(2023, 6, 1, 13), status: "finished", type: "delivery", title: "Picobello B.V.", message: "casc!",},
    {id: "4", time: new Date(2023, 6, 1, 13), status: "finished", type: "delivery", title: "Picobello B.V.", message: "casc!",},
    {id: "5", time: new Date(2023, 5, 30), status: "accepted", type: "delivery", title: "Douwe Egberts", message: "rqwrqw!",},
    {id: "6", time: new Date(2023, 5, 30), status: "finished", type: "delivery", title: "Wiebra", message: "asd!",},
    {id: "7", time: new Date(2023, 5, 30), status: "finished", type: "delivery", title: "Test", message: "eq!",},
    {id: "8", time: new Date(2023, 4, 30), status: "finished", type: "delivery", title: "Test", message: "eq!",},
    {id: "9", time: new Date(2023, 4, 26, 12), status: "finished", type: "delivery", title: "Test", message: "eq!",},
    {id: "10", time: new Date(2023, 4, 26, 13), status: "finished", type: "delivery", title: "Test", message: "eq!",},
    {id: "11", time: new Date(2023, 4, 26, 13), status: "finished", type: "delivery", title: "Test", message: "eq!",},
    {id: "12", time: new Date(2023, 4, 26, 13), status: "finished", type: "delivery", title: "Test", message: "eq!",},
    {id: "13", time: new Date(2023, 4, 26, 13), status: "finished", type: "delivery", title: "Test", message: "eq!",},
    {id: "14", time: new Date(2023, 4, 26, 13), status: "finished", type: "delivery", title: "Test", message: "eq!",},
    {id: "15", time: new Date(2023, 4, 26, 13), status: "declined", type: "delivery", title: "Test", message: "eq!",},
]
