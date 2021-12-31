using System.Collections;
using System.Collections.Generic;

namespace BackEnd.IntegrationTests.Reservations {

    public class NewAdminReservationWithErrors : IEnumerable<object[]> {

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
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 432,
                    Date = "2021-10-04",
                    CustomerId = 1, // SKILES, CUMMERATA AND NICOLAS
                    DestinationId = 1, // PAXOS
                    PickupPointId = 1, // RODA BEACH, RouteId = 5, PortId = 1
                    Adults = 3,
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] We_Dont_Go_To_Paxos_On_2021_10_02() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 430,
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    Date = "2021-10-02",
                    CustomerId = 1, // SKILES, CUMMERATA AND NICOLAS
                    DestinationId = 1, // PAXOS
                    PickupPointId = 1, // RODA BEACH, RouteId = 5, PortId = 1
                    Adults = 3,
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] We_Dont_Go_To_Blue_Lagoon_From_Lefkimmi_On_2021_10_02() {
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 427,
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    Date = "2021-10-02",
                    CustomerId = 1, // SKILES, CUMMERATA AND NICOLAS
                    DestinationId = 3, // BLUE LAGOON
                    PickupPointId = 94, // KAVOS TAXI STATION, RouteId = 4, PortId = 2
                    Adults = 3,
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] Overbooking_From_Primary_Port_Is_Not_Allowed() {
            // According to the schedule: Max persons = 185 (Corfu)
            // According to the reservations: Corfu (84)
            // Free seats = 101
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 433,
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    Date = "2021-10-01",
                    CustomerId = 1, // SKILES, CUMMERATA AND NICOLAS
                    DestinationId = 1, // PAXOS
                    PickupPointId = 3, // VIVA BAR, RouteId = 1, PortId = 1
                    Adults = 102, // Cause overbooking
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] Overbooking_From_Secondary_Port_Is_Not_Allowed() {
            // According to the schedule: Max persons = 185 (Corfu) + 215 (Lefkimmi) = 400
            // According to the reservations: Corfu (84) + Lefkimmi (50) = 134
            // Free seats = 400 - 134 = 266
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 433,
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    Date = "2021-10-01",
                    CustomerId = 1, // SKILES, CUMMERATA AND NICOLAS
                    DestinationId = 1, // PAXOS
                    PickupPointId = 4, // SUMMERTIME HOTEL, RouteId = 4, PortId = 2
                    Adults = 267, // Cause overbooking
                    TicketNo = "xxxx"
                }
            };
        }

        private static object[] Duplicate_Records_Are_Not_Allowed() {
            // Checking for Date, DestinationId, CustomeId and TicketNo
            return new object[] {
                new TestReservation {
                    FeatureUrl = "/reservations/",
                    StatusCode = 409,
                    UserId = "e7e014fd-5608-4936-866e-ec11fc8c16da",
                    Date = "2021-10-01",
                    DestinationId = 1,
                    CustomerId = 14,
                    PickupPointId = 285,
                    Adults = 2,
                    TicketNo = "SBQRQ"
                }
            };
        }

    }

}
