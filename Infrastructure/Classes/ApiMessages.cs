namespace CorfuCruises {

    public static class ApiMessages {

        // Only used by the API
        // In normal program execution they will be replaced by Angular in the selected language

        #region Info

        public static string EmailInstructions() { return "An email was sent with instructions."; }
        public static string PasswordChanged() { return "Password was changed successfully."; }
        public static string PasswordReset() { return "Password was reset successfully."; }
        public static string RecordCreated() { return "Record created."; }
        public static string FileCreated() { return "File created."; }
        public static string RecordDeleted() { return "Record deleted."; }
        public static string RecordUpdated() { return "Record updated."; }

        #endregion

        #region Errors

        public static string AccountNotConfirmed() { return "This account is pending email confirmation."; }
        public static string RecordInUse() { return "This record is in use and can not be deleted."; }
        public static string AuthenticationFailed() { return "Authentication failed."; }
        public static string RecordNotFound() { return "Record not found."; }
        public static string DefaultDriverAlreadyExists() { return "There is already a default driver."; }
        public static string DefaultDriverNotFound() { return "Default driver not found."; }
        public static string RecordNotSaved() { return "Record not saved."; }
        public static string FileNotCreated() { return "File not created."; }
        public static string InvalidModel() { return "The model is invalid"; }
        public static string EmailNotSent() { return "Email not sent"; }
        public static string DuplicateRecord() { return "Duplicate records are not allowed"; }

        #endregion

    }

}