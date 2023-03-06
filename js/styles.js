import { StyleSheet } from "react-native";

export function getStyles() {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
    },
    headerContainer: {
      backgroundColor: "#EECBAD",
      width: "100%",
      height: 100,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
      overflow: "hidden",
      fontWeight: "bold",
      borderWidth: 1,
      borderColor: "#000",
    },
    footer: {
    //   flex: 1,
      width: "100%",
      height: 400,
      alignItems: "center",
      overflow: "hidden",
      fontWeight: "bold",
      borderWidth: 0,
      borderColor: "#000",
      top: 0,
      borderBottomWidth: 0,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "lightgray",
      backgroundColor: "#f1f8ff",
    },
    rowText: {
      fontSize: 20,
      color: "black",
      verticalMargin: 1,
      paddingLeft: 5,
    },
    centerContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    topicsTableContainer: {
      width: "100%",
      flex: 1,
      alignItems: "left",
      justifyContent: "center",
    //   marginTop: 5,
      marginLeft: 0,
      borderLeftWidth: 1,
      borderTopWidth: 1
    },
    topContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 0,
    },
    bottomContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
      paddingBottom: 0,
    },
    flatList: {
      maxHeight: "100%",
      width: "100%",
    },
    bottomLeftCornerContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
    },
    topLeftCornerContainer: {
      position: "absolute",
      top: 50,
      left: 40,
    },
    topRightCornerFirstPositionContainer: {
      position: "absolute",
      top: 50,
      right: 40,
    },
    topRightCornerSecondPositionContainer: {
      position: "absolute",
      top: 50,
      right: 50,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });
}
