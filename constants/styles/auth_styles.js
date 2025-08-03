import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center", // centers vertically
    alignItems: "center", // centers horizontally
    paddingHorizontal: 20,
    paddingBottom: 80,
  },

  forgotContainer:{
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center", // centers vertically
    alignItems: "center", // centers horizontally
    paddingHorizontal: 20,
    paddingBottom: 80,
  },


  logo: {
    width: 250,
    height: 200,
    marginBottom: 80,
  },

  formContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: -70,
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
    transform: [{ scale: 0.9 }],
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

  sendEmailButton: {
    width: '70%',
    alignItems:"stretch",
    marginLeft: 55,
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
