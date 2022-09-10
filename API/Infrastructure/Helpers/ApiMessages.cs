namespace API.Infrastructure.Helpers {

    public enum Icons {
        Success,
        Info,
        Warning,
        Error
    }

    public static class ApiMessages {

        #region Generic Messages

        public static string OK() { return "OK"; }
        public static string RecordCreated() { return "Record created"; }
        public static string RecordUpdated() { return "Record updated"; }
        public static string RecordDeleted() { return "Record deleted"; }
        public static string RecordInUse() { return "Record not deleted"; }
        public static string AuthenticationFailed() { return "Authentication failed."; }
        public static string RecordNotFound() { return "Record not found"; }
        public static string UnknownError() { return "Something exceptional has happened."; }
        public static string InvalidModel() { return "The model is invalid."; }
        public static string EmailNotSent() { return "Email not sent."; }
        public static string RecordNotSaved() { return "Record not saved."; }
        public static string UnableToDeleteConnectedUser() { return "The connected user can't be deleted."; }
        public static string DateHasWrongFormat() { return "Date must be in 'YYYY-MM-DD' format"; }
        public static string EmailHasWrongFormat() { return "Email is not in the correct format"; }
        public static string LogoutError() { return "The user is not logged in."; }
        public static string FKNotFoundOrInactive(string fk) { return $"{fk} does not exist or is inactive"; }
        public static string NotUniqueUser() { return "The username and the email must be unique"; }

        #endregion

        #region  App Specific Messages

        public static string DuplicateRecord() { return "Duplicate records are not allowed."; }
        public static string DayHasNoSchedule() { return "For this day nothing is scheduled."; }
        public static string DayHasNoScheduleForDestination() { return "For this day and destination nothing is scheduled."; }
        public static string PortHasNoDepartures() { return "For this day and destination, nothing is scheduled to depart from the given port."; }
        public static string PortHasNoVacancy() { return "Overbooking in not allowed."; }
        public static string UnableToCreateUser() { return "We were unable to create this user. Make sure that the username and the email are unique."; }
        public static string NotOwnRecord() { return "This record belongs to another user."; }
        public static string InvalidPassengerCount() { return "Total persons must be equal or greater than the passenger count."; }
        public static string SimpleUserNightRestrictions() { return "New reservations for the next day with transfer after 22:00 are not allowed"; }
        public static string SimpleUserCanNotAddReservationAfterDepartureTime() { return "Reservations after departure are not allowed"; }

        #endregion

    }

}