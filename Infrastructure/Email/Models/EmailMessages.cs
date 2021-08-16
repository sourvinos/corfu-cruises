namespace BlueWaterCruises {

    public static class EmailMessages {

        public static string[] FirstLoginCredentials(string language) {
            switch (language) {
                case "cs-CZ":
                    return new[] {
                        "(CZ) Hello, ",
                        "(CZ) Use the following credentials to login:",
                        "(CZ) User: " ,
                        "(CZ) Password: ",
                        "(CZ) Warning:",
                        "(CZ) This is a one-time password and can be used only once.",
                        "(CZ) You must change it immediately after your first login.",
                        "(CZ) Login",
                        "(CZ) Thank you for using our online platform.",
                        "(CZ) Best regards,",
                        "(CZ) Login credentials"
                     };
                case "de-DE":
                    return new[] {
                        "(DE) Hello, ",
                        "(DE) Use the following credentials to login:",
                        "(DE) User: " ,
                        "(DE) Password: ",
                        "(DE) Login",
                        "(DE) Thank you for using our online platform.",
                        "(DE) Best regards,",
                        "(DE) Login credentials"
                     };
                case "el-GR":
                    return new[] {
                        "Γεια σας, ",
                        "Χρησιμοποιηστε τα παρακατω στοιχεια για να συνδεθειτε:",
                        "Χρηστης: " ,
                        "Κωδικος: ",
                        "Συνδεση",
                        "Ευχαριστουμε που χρησιμοποιειτε την online πλατφορμα μας.",
                        "Με φιλικους χαιρετισμους,",
                        "Στοιχεια συνδεσης"
                    };
                case "en-GB":
                    return new[] {
                        "Hello, ",
                        "Use the following credentials to login:",
                        "User: " ,
                        "Password: ",
                        "Login",
                        "Thank you for using our online platform.",
                        "Best regards,",
                        "Login credentials"
                     };
                case "fr-FR":
                    return new[] {
                        "Salut, ",
                        "Utilisez les informations d'identification suivantes pour vous connecter:",
                        "Nom d'utilisateur: " ,
                        "Mot de passe: ",
                        "Connexion",
                        "Thank you for using our online platform.",
                        "Cordiales salutations,",
                        "Login credentials"
                     };
                default:
                    return new[] {
                        "Hello, ",
                        "Use the following credentials to login:",
                        "User: " ,
                        "Password: ",
                        "Login",
                        "Thank you for using our online platform.",
                        "Best regards,",
                        "Login credentials"
                    };
            }
        }

        public static string[] ResetPassword(string language) {
            switch (language) {
                case "cs-CZ":
                    return new[] {
                        "(CZ) Hello, ",
                        "(CZ) You have requested a password reset.",
                        "(CZ) Click the following link to set a new password:",
                        "(CZ) Password reset",
                        "(CZ) Warning:",
                        "(CZ) This is a one-time link and can be used only once.",
                        "(CZ) As soon as you've set a new password it will be invalid.",
                        "(CZ) Thank you for using our online platform.",
                        "(CZ) Kind regards,",
                        "(CZ) Password reset"
                    };
                case "de-DE":
                    return new[] {
                        "(DE) Hello, ",
                        "(DE) You have requested a password reset.",
                        "(DE) Click the following link to set a new password:",
                        "(DE) Password reset",
                        "(DE) Warning:",
                        "(DE) This is a one-time link and can be used only once.",
                        "(DE) As soon as you've set a new password it will be invalid.",
                        "(DE) Thank you for using our online platform.",
                        "(DE) Kind regards,",
                        "(DE) Password reset"
                    };
                case "el-GR":
                    return new[] {
                        "Γεια σας, ",
                        "Εχετε ζητησει επαναφορα κωδικου.",
                        "Καντε κλικ στον παρακατω συνδεσμο για να καταχωρησετε νεο κωδικο:",
                        "Επαναφορα κωδικου",
                        "Προσοχη:",
                        "Αυτος ο συνδεσμος ισχυει μονο για μια φορα.",
                        "Μολις καταχωρησετε νεο κωδικο παυει να ισχυει.",
                        "Ευχαριστουμε που χρησιμοποιειτε την online πλατφορμα μας.",
                        "Με φιλικους χαιρετισμους,",
                        "Επαναφορα κωδικου"
                    };
                case "en-GB":
                    return new[] {
                        "Hello, ",
                        "You have requested a password reset.",
                        "Click the following link to set a new password:",
                        "Password reset",
                        "Warning:",
                        "This is a one-time link and can be used only once.",
                        "As soon as you've set a new password it will be invalid.",
                        "Thank you for using our online platform.",
                        "Kind regards,",
                        "Password reset"
                    };
                default:
                    return new[] {
                        "Hello, ",
                        "You have requested a password reset.",
                        "Click the following link to set a new password:",
                        "Password reset",
                        "Warning:",
                        "This is a one-time link and can be used only once and",
                        "as soon as you've set a new password it will be invalid.",
                        "Thank you for using our online platform.",
                        "Kind regards,",
                        "Password reset"
                    };
            }
        }

    }

}