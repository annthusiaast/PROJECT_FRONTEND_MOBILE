import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

//Login.tsx
 User_Pass_View: {
    marginLeft: 50,
     marginTop: 20,
 },

  logo: {
    width: 250,
    height: 200,
    marginTop: 100,
    marginLeft: 80,
  },

  inputContainer: {
    gap: 1,
    padding: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    width: '90%',
    borderWidth: 2,
    borderColor: 'darkblue',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    color: 'black',
    },

  Remember_Forgot_View: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginLeft: 50,
    marginTop: 10,
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
    flexDirection: 'row',
    width: '90%',
    marginLeft: 95,
    marginTop: 30,
  },

  loginButtonGradient: {
    padding: 20,
    borderRadius: 20,
    width: '60%',
  },

  loginButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },

  leftIcon: {
    marginRight: 12,
    marginTop: 10,
  },

  eyeIcon: {
    marginRight: 12,
    marginTop: 10,
  },

  TextInputWithIcon: {
    flex: 1,
    height: 40,
    color: '#000',
    fontSize: 16,
  },
});