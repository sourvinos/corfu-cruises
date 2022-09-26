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
        public static string RecordInUse() { return "Record is used and can't be deleted"; }
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
        public static string InvalidDateDestinationOrPort() { return "The reservation for 05/05/2020 is invalid for one of the following reasons: a) Nothing is scheduled for this day (we have a day-off!) b) We don't go to PAXOS-ANTIPAXOS (even though we go somewhere else) c) There are no departures from LEFKIMMI PORT to PAXOS-ANTIPAXOS (even though we depart from another port to PAXOS-ANTIPAXOS)"; }
        public static string PortHasNoVacancy() { return "Overbooking in not allowed."; }
        public static string NotOwnRecord() { return "This record in not yours to edit."; }
        public static string InvalidCustomer() { return "The customer doesn't exist."; }
        public static string InvalidDestination() { return "The destination doesn't exist."; }
        public static string InvalidDriver() { return "The driver doesn't exist."; }
        public static string InvalidShip() { return "The ship doesn't exist."; }
        public static string InvalidShipOwner() { return "The shipowner doesn't exist or is inactive."; }
        public static string InvalidNationality() { return "The nationality doesn't exist."; }
        public static string InvalidGender() { return "The gender doesn't exist."; }
        public static string InvalidOccupant() { return "The occupant doesn't exist."; }
        public static string InvalidPickupPoint() { return "The pickup point doesn't exist."; }
        public static string InvalidCoachRoute() { return "The coach route doesn't exist."; }
        public static string InvalidPassengerCount() { return "Total persons must be equal or greater than the passenger count."; }
        public static string SimpleUserNightRestrictions() { return "New reservations for the next day with transfer after 22:00 are not allowed"; }
        public static string SimpleUserCanNotAddReservationAfterDepartureTime() { return "Reservations after departure are not allowed"; }
        public static string EmbarkedPassengerWasNotFound() { return "OK, but at least one of the passengers was not found."; }
        public static string InvalidPortOrder() { return "The stop order already exists."; }

        #endregion

    }

}