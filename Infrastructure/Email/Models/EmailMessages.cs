namespace CorfuCruises {

    public static class EmailMessages {

        public static string AccountActivatedSuccessfully(string language) {
            switch (language) {
                case "el-GR":
                    return "Αυτοσ ο λογαριασμοσ ειναι τωρα ενεργοσ!";
                case "en-GB":
                    return "This account is now active!";
                case "de-DE":
                    return "Dieses Benutzerkonto ist jetzt aktiv!";
                case "cs-CZ":
                    return "Účet je nyní aktivní!";
                default:
                    return "";
            }
        }

        public static string AccountAlreadyActivatedOrError(string language) {
            switch (language) {
                case "el-GR":
                    return "Αυτοσ ο λογαριασμοσ ειναι ηδη ενεργοσ!";
                case "en-GB":
                    return "This account is already active!";
                case "de-DE":
                    return "Dieses Benutzerkonto ist bereits aktiv!";
                case "cs-CZ":
                    return "Účet je již aktivní!";
                default:
                    return "";
            }
        }

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
                        "(DE) Warning:",
                        "(DE) This is a one-time password and can be used only once.",
                        "(DE) You must change it immediately after your first login.",
                        "(DE) Login",
                        "(DE) Thank you for using our online platform.",
                        "(DE) Best regards,",
                        "(DE) Login credentials"
                     };
                case "el-GR":
                    return new[] {
                        "Γεια σας, ",
                        "Χρησιμοποιήστε τα παρακάτω στοιχεία για να συνδεθείτε:",
                        "Χρήστης: " ,
                        "Κωδικός: ",
                        "Προσοχή:",
                        "Ο κωδικός είναι προσωρινός και μπορεί να χρησιμοποιηθεί μόνο μια φορά.",
                        "Πρέπει να τον αλλάξετε αμέσως μετά την πρώτη σύνδεσή σας.",
                        "Σύνδεση",
                        "Ευχαριστούμε που χρησιμοποιείτε την online πλατφόρμα μας.",
                        "Με φιλικούς χαιρετισμούς,",
                        "Στοιχεία σύνδεσης"
                    };
                case "en-GB":
                    return new[] {
                        "Hello, ",
                        "Use the following credentials to login:",
                        "User: " ,
                        "Password: ",
                        "Warning:",
                        "This is a one-time password and can be used only once.",
                        "You must change it immediately after your first login.",
                        "Login",
                        "Thank you for using our online platform.",
                        "Best regards,",
                        "Login credentials"
                     };
                default:
                    return new[] {
                        "Hello, ",
                        "Use the following credentials to login:",
                        "User: " ,
                        "Password: ",
                        "Warning:",
                        "This is a one-time password and can be used only once.",
                        "You must change it immediately after your first login.",
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
                        "Εχετε ζητήσει επαναφορά κωδικού.",
                        "Καντε κλικ στον παρακάτω σύνδεσμο για να καταχωρήσετε νέο κωδικό:",
                        "Επαναφορα κωδικου",
                        "Προσοχή:",
                        "Αυτός ο σύνδεσμος ισχύει μόνο για μία φορά.",
                        "Μόλις καταχωρήσετε νέο κωδικό παύει να ισχύει.",
                        "Ευχαριστούμε που χρησιμοποιείτε την online πλατφόρμα μας.",
                        "Με φιλικούς χαιρετισμούς,",
                        "Επαναφορά κωδικού"
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