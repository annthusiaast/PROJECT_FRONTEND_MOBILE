import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center", // centers vertically
    alignItems: "center", // centers horizontally
    paddingHorizontal: 20,
  },

  logo: {
    width: 250,
    height: 200,
    marginBottom: 0,
  },

  formContainer: {
    width: "100%",
    alignItems: "center",
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: "center",
    backgroundColor: 'white',
    width: '90%',
    borderWidth: 2,
    borderColor: 'darkblue',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },

  leftIcon: {
    marginRight: 10,
  },

  eyeIcon: {
    marginLeft: 10,
  },

  TextInputWithIcon: {
    flex: 1,
    height: 40,
    color: '#000',
    fontSize: 16,
  },

  Remember_Forgot_View: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },

  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  textRemember: {
    color: '#111010ff',
    fontSize: 14,
    marginLeft: 8,
  },

  textForgot: {
    color: '#173B7E',
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  loginButton: {
    width: '90%',
  },

  loginButtonGradient: {
    padding: 15,
    borderRadius: 20,
  },

  loginButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
