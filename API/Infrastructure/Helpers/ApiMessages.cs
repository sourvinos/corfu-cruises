namespace API.Infrastructure.Helpers {

    public static class ApiMessages {

        #region Info

        public static string EmailInstructions() { return "An email was sent with instructions."; }
        public static string PasswordChanged() { return "Password was changed successfully."; }
        public static string PasswordReset() { return "Password was reset successfully."; }
        public static string RecordCreated() { return "Record created."; }
        public static string FileCreated() { return "File created."; }
        public static string RecordDeleted() { return "Record deleted."; }
        public static string RecordUpdated() { return "Record updated."; }
        public static string LogoutSuccess() { return "Logout was successful."; }

        #endregion

        #region Errors

        public static string AccountNotConfirmed() { return "This account is pending email confirmation."; }
        public static string RecordIsInUse() { return "This record is in use and can not be deleted."; }
        public static string AuthenticationFailed() { return "Authentication failed."; }
        public static string RecordNotFound() { return "Record not found."; }
        public static string RecordNotSaved() { return "Record not saved."; }
        public static string FileNotCreated() { return "File not created."; }
        public static string InvalidModel() { return "The model is invalid."; }
        public static string EmailNotSent() { return "Email not sent."; }
        public static string DateHasWrongFormat() { return "Date must be in 'YYYY-MM-DD' format"; }
        public static string EmailHasWrongFormat() { return "Email is not in the correct format"; }
        public static string DuplicateRecord() { return "Duplicate records are not allowed."; }
        public static string DayHasNoSchedule() { return "For this day nothing is scheduled."; }
        public static string DayHasNoScheduleForDestination() { return "For this day and destination nothing is scheduled."; }
        public static string PortHasNoDepartures() { return "For this day and destination, nothing is scheduled to depart from the given port."; }
        public static string PortHasNoVacancy() { return "Overbooking in not allowed."; }
        public static string LogoutError() { return "The user is not logged in."; }
        public static string NotOwnRecord() { return "This record belongs to another user."; }
        public static string InsufficientUserRights() { return "This action requires higher authorization level."; }
        public static string UserCanNotAddReservationInThePast() { return "Reservations for past dates are not allowed."; }
        public static string InvalidPassengerCount() { return "Total persons must be equal or greater than the passenger count."; }
        public static string InvalidShipRouteFromTime() { return "From time is missing or invalid"; }
        public static string InvalidShipRouteViaTime() { return "Via time is invalid"; }
        public static string InvalidShipRouteToTime() { return "To time is missing or invalid"; }
        public static string FKNotFoundOrInactive(string fk) { return $"{fk} does not exist or is inactive"; }
        public static string InvalidMaxPassengers() { return "Maximum passengers must be between 0 and 999"; }

        #endregion

    }

}