using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests {

    public class NewReservationWithErrors : IEnumerable<object[]> {

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public IEnumerator<object[]> GetEnumerator() {
            yield return this.We_Dont_Go_Anywhere_On_2021_10_04();
            yield return this.We_Dont_Go_To_Paxos_On_2021_10_02();
            yield return this.We_Dont_Go_To_Blue_Lagoon_From_Lefkimmi_On_2021_10_02();
            yield return this.Overbooking_From_Primary_Port_Is_Not_Allowed();
            yield return this.Overbooking_From_Secondary_Port_Is_Not_Allowed();
            yield return this.Duplicate_Records_Are_Not_Allowed();
        }

        private object[] We_Dont_Go_Anywhere_On_2021_10_04() {
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

        private object[] We_Dont_Go_To_Paxos_On_2021_10_02() {
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

        private object[] We_Dont_Go_To_Blue_Lagoon_From_Lefkimmi_On_2021_10_02() {
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

        private object[] Overbooking_From_Primary_Port_Is_Not_Allowed() {
            // Date: 2021-10-01
            // Destination: Paxos (1)
            // Port: Corfu (1)
            // According to the schedule: Max persons = 185
            // According to the reservations: Persons = 59
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
                    Adults = 150, // Overbooking
                    Kids = 0,
                    Free = 0,
                    TicketNo = "xxxx"
                }
            };
        }

        private object[] Overbooking_From_Secondary_Port_Is_Not_Allowed() {
            // Date: 2021-10-01
            // Destination: Paxos (1)
            // Port: Lefkimmi (2)
            // According to the schedule: Max persons = 185 (Corfu) + 215 (Lefkimmi) = 400
            // According to the reservations: Persons = 59 (Corfu) + 51 (Lefkimmi) = 110
            // Free seats = 400 - 110 = 290
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
                    Adults = 300, // Overbooking
                    Kids = 0,
                    Free = 0,
                    TicketNo = "xxxx"
                }
            };
        }

        private object[] Duplicate_Records_Are_Not_Allowed() {
            // Checking for Date, DestinationId, CustomeId, TicketNo
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
                    PortId = 2, // LEFKIMMI
                    Adults = 2,
                    Kids = 0,
                    Free = 0,
                    TicketNo = "EZFHG"
                }
            };
        }

    }

}
