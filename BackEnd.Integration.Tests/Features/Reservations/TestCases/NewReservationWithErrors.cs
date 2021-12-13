using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Reservations {

    public class NewReservationWithErrors : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return We_Dont_Go_Anywhere_On_2021_10_04();
            yield return We_Dont_Go_To_Paxos_On_2021_10_02();
            yield return We_Dont_Go_To_Blue_Lagoon_From_Lefkimmi_On_2021_10_02();
            yield return Overbooking_From_Primary_Port_Is_Not_Allowed();
            yield return Overbooking_From_Secondary_Port_Is_Not_Allowed();
            yield return Duplicate_Records_Are_Not_Allowed();
        }

        private static object[] We_Dont_Go_Anywhere_On_2021_10_04() {
            return new object[] {
                new Reservation {
                    FeatureUrl = "/reservations/",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ExpectedResponseCode = 432,
                    Date = "2021-10-04",
                    DestinationId = 1, // PAXOS
                    CustomerId = 1, // SKILES, CUMMERATA AND NICOLAS
                    PortId = 1, // CORFU PORT
                    Adults = 3,
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] We_Dont_Go_To_Paxos_On_2021_10_02() {
            return new object[] {
                new Reservation {
                    FeatureUrl = "/reservations/",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ExpectedResponseCode = 430,
                    Date = "2021-10-02",
                    DestinationId = 1, // PAXOS
                    CustomerId = 1, // SKILES, CUMMERATA AND NICOLAS
                    PortId = 1, // CORFU PORT
                    Adults = 3,
                    Kids = 0,
                    Free = 0,
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] We_Dont_Go_To_Blue_Lagoon_From_Lefkimmi_On_2021_10_02() {
            return new object[] {
                new Reservation {
                    FeatureUrl = "/reservations/",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ExpectedResponseCode = 427,
                    Date = "2021-10-02",
                    DestinationId = 3, // BLUE LAGOON
                    CustomerId = 1, // SKILES, CUMMERATA AND NICOLAS
                    PortId = 2, // LEFKIMMI
                    Adults = 3,
                    Kids = 0,
                    Free = 0,
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] Overbooking_From_Primary_Port_Is_Not_Allowed() {
            // Date: 2021-10-01
            // Destination: Paxos (1)
            // Port: Corfu (1)
            // According to the schedule: Max persons = 185
            // According to the reservations: Persons = 84
            // Free seats = 185 - 59 = 126
            return new object[] {
                new Reservation {
                    FeatureUrl = "/reservations/",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ExpectedResponseCode = 433,
                    Date = "2021-10-01",
                    DestinationId = 1, // PAXOS
                    CustomerId = 1, // SKILES, CUMMERATA AND NICOLAS
                    PortId = 1, // CORFU
                    Adults = 101, // Overbooking
                    Kids = 0,
                    Free = 0,
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] Overbooking_From_Secondary_Port_Is_Not_Allowed() {
            // Date: 2021-10-01
            // Destination: Paxos (1)
            // Port: Lefkimmi (2)
            // According to the schedule: Max persons = 185 (Corfu) + 215 (Lefkimmi) = 400
            // According to the reservations: Corfu (84) + Lefkimmi (50) = 134
            // Free seats = 400 - 134 = 266
            return new object[] {
                new Reservation {
                    FeatureUrl = "/reservations/",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ExpectedResponseCode = 433,
                    Date = "2021-10-01",
                    DestinationId = 1, // PAXOS
                    CustomerId = 1, // SKILES, CUMMERATA AND NICOLAS
                    PortId = 2, // LEFKIMMI
                    Adults = 267, // Overbooking
                    Kids = 0,
                    Free = 0,
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] Duplicate_Records_Are_Not_Allowed() {
            // Checking for Date and DestinationId and CustomeId and TicketNo
            return new object[] {
                new Reservation {
                    FeatureUrl = "/reservations/",
                    Username = "john",
                    Password = "ec11fc8c16da",
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    ExpectedResponseCode = 409,
                    Date = "2021-10-01",
                    DestinationId = 1, // PAXOS
                    CustomerId = 14, // WILLMS - VOLKMAN
                    PortId = 1, // CORFU
                    Adults = 2,
                    Kids = 0,
                    Free = 0,
                    TicketNo = "SBQRQ"
                }
            };
        }

    }

}
