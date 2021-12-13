using System;
using System.Collections.Generic;

namespace BlueWaterCruises.Infrastructure.SeedData {

    public static class Helpers {

        public static string CreateRandomSentence(int i) {
            List<string> remarks = new() {
                "food included",
                "very fussy customer",
                "drinks included",
                "pay half price",
                "pay on board 20euros",
                "pets pay half price"
            };
            return (10 % i == 0) ? remarks[new Random().Next(remarks.Count)].ToUpper() : "";
        }

        public static DateTime CreateRandomDate() {
            Random x = new();
            DateTime start = new(1960, 1, 1);
            int range = (DateTime.Today - start).Days;
            return start.AddDays(x.Next(range));
        }

        public static string CreateRandomName() {
            List<string> names = new() {
                "Sol Fries",
                "Braeleigh Coss",
                "Joana Nakamura",
                "Adelle Pinkerton",
                "Rocket Lacasse",
                "Oden Moorman",
                "Kaci Ricci",
                "Amoni Speight",
                "Brenley Boatright",
                "Jaylene Ngo",
                "Jori Griner",
                "Rowynn Reader",
                "Yamileth Hoyt",
                "Fradel Frakes",
                "Ainsleigh Wan",
                "Adalene Beckley",
                "Alona Lemaster",
                "Elliotte Newhouse",
                "Alpha Tiffany",
                "Lya Oviedo",
                "Winifred Garber",
                "Abbygail Clevenger",
                "Deen Welton",
                "Ames Sokol",
                "Chimamanda Napoli",
                "Avaleigh Swank",
                "Kerrington Benally",
                "Laci Waugh",
                "Jonah Oliver",
                "Caesar Mateo",
                "Halie Stella",
                "Damiyah Blodgett",
                "Zymir Hogg",
                "Bahar Holmquist",
                "Chevy Burnham",
                "Jasiyah Stalnaker",
                "Maddisyn Welborn",
                "Jaelyn Knowles",
                "Alaynna Nabors",
                "Justus Stribling",
                "Giada Cutler",
                "Fern Rau",
                "Darianna Lazaro",
                "Madelyne Valdovinos",
                "Analee Pond",
                "Zeinab Quijano",
                "Brodie Delatorre",
                "Evelynne Kingston",
                "Leandre Deen",
                "Mckynlee Baldridge",
                "Lleyton Arms",
                "Salina Sawyers",
                "Constance Duckworth",
                "Nivaan Ruble",
                "Mariel Loya",
                "Zaid Otero",
                "Irma Trowbridge",
                "Nasir Mcfadden",
                "Adamaris Snook",
                "Adalia Currier",
                "Alder Albin",
                "Shaylyn Glasser",
                "Helena Springer",
                "Theodora Fort",
                "Deegan Harp",
                "Brynley Leone",
                "Dontavious Pecoraro",
                "Treysen Kujawa",
                "Juliette Tyler",
                "Kit Knighten",
                "Aleen Boren",
                "Nikayla Ottinger",
                "Elvira Nickell",
                "Bruce Hahn",
                "Tinley Sylvester",
                "Neel Salcido",
                "Camille Velasquez",
                "Saif Loveless",
                "Afton Mcclintock",
                "Rayaan Tapp",
                "Ariane Garvey",
                "Shahd Schoenfeld",
                "Betty Lundy",
                "Rylen Squires",
                "Taggart Dryer",
                "Kyliee Lemmon",
                "Myles Burgess",
                "Hosanna Hoffer",
                "Aziah Cogswell",
                "Yaniel Shockey",
                "Alize Zayas",
                "Johnnie Hoy",
                "River Villanueva",
                "Eyad Horning",
                "Maida Guyer",
                "Humza Broadwater",
                "Clio Campa",
                "Aedan Mcnulty",
                "TRUE Silvestri",
                "Lavon Searles",
            };
            return names[new Random().Next(names.Count)].ToUpper();
        }

        public static int CreateRandomInteger(int min, int max) {
            Random rand = new();
            return rand.Next(min, max);
        }

        public static int CreateRandomPassengerCount(int min, int max) {
            Random rand = new();
            return rand.Next(min, max);
        }

        public static string CreateRandomEmail() {
            List<string> emails = new() {
                "neoma11@gmail.com",
                "carlos61@hotmail.com",
                "jerod_collier17@hotmail.com",
                "daphney69@yahoo.com",
                "janessa95@hotmail.com",
                "kattie.glover76@gmail.com",
                "frankie69@gmail.com",
                "lincoln_luettgen@gmail.com",
                "jessica_bruen@yahoo.com",
                "lonnie_mosciski@yahoo.com",
                "brittany.thiel@yahoo.com",
                "edwardo_crona71@yahoo.com",
                "brain_considine@yahoo.com",
                "jonatan_kris@hotmail.com",
                "ottis97@hotmail.com",
                "itzel_conn@hotmail.com",
                "jacklyn1@yahoo.com",
                "jonas84@yahoo.com",
                "murl.skiles37@yahoo.com",
                "delbert.beatty@hotmail.com",
                "vaughn.blanda88@gmail.com",
                "elsie.kutch20@gmail.com",
                "annabelle95@hotmail.com",
                "eddie.gorczany@gmail.com",
                "brooklyn.bernhard9@yahoo.com",
                "xander1@yahoo.com",
                "johnny.labadie65@hotmail.com",
                "duncan.oconnell44@yahoo.com",
                "cameron5@yahoo.com",
                "tate56@gmail.com",
                "gavin.weber87@hotmail.com",
                "merle_langworth@gmail.com",
                "shanie_luettgen@gmail.com",
                "maria_paucek50@yahoo.com",
                "matt.littel92@yahoo.com",
                "wellington69@yahoo.com",
                "lesley_cassin25@gmail.com",
                "brock37@hotmail.com",
                "ethel_glover@yahoo.com",
                "jaren32@yahoo.com",
                "gracie16@yahoo.com",
                "pearl53@yahoo.com",
                "lennie_kuvalis@yahoo.com",
                "polly_shanahan@gmail.com",
                "waino17@hotmail.com",
                "justyn9@gmail.com",
                "amina_frami@yahoo.com",
                "emil_lueilwitz@gmail.com",
                "thora.rutherford90@hotmail.com",
                "lizeth_jones@hotmail.com",
            };
            return emails[new Random().Next(emails.Count)].ToUpper();
        }

        public static string CreateRandomTicketNo(int length) {
            const string characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var random = new Random();
            var ticket = new char[length];
            for (int i = 0; i < ticket.Length; i++) {
                ticket[i] = characters[random.Next(characters.Length)];
            }
            return new String(ticket);
        }

        public static bool ConvertToBoolean(int i) {
            return i % 2 != 0;
        }

        public static string CreateRandomAddress() {
            List<string> addresses = new() {
                "026 Delilah Avenue, Suite 058, 29145-4653, Considineborough",
                "02946 Bayer Vista, Suite 400, 80758-2991, Port Theron",
                "05106 Auer Mission, Suite 635, 40457, Lake Fatima",
                "01362 Jovany Oval, Apt. 045, 27918, Port Ezekielport",
                "9182 Roxane Landing, Suite 564, 62630-4595, Lake Rashawn",
                "1572 Legros Union, Suite 759, 23704-6192, Koelpinville",
                "1897 Leopold Shoals, Apt. 730, 99655-9617, Everardomouth",
                "99661 Muhammad Fort, Suite 773, 63053-0239, Shanelside",
                "76901 Horacio Square, Apt. 822, 77125, West Delphiatown",
                "0272 Arch Junction, Suite 539, 97393-4709, Port Matildastad",
                "90797 Ana Spring, Apt. 650, 24175-3026, Gusikowskifort",
                "183 Aron Station, Apt. 269, 32281-0384, Port Leslie,",
                "2770 Janae Crest, Suite 578, 82906-3604, East Otisborough,",
                "1817 Dakota Dale, Suite 616, 42317, East Jonathanhaven",
                "396 Arnulfo Grove, Suite 830, 65912-5919, Wizafort",
                "40738 Paucek Pines, Apt. 416, 63117-4211, West Abel",
                "35417 Jermaine Shoal, Suite 591, 07435, South Rick",
                "3494 Kassulke Knoll, Apt. 779, 30224, Darbymouth",
                "0426 Pfannerstill Lights, Apt. 695, 74155, Glendaborough",
                "0752 Dakota Keys, Suite 394, 53940-4735, South Alejandrinview",
                "6992 Orn Tunnel, Suite 660, 66893-0169, West Consuelo",
                "483 Kenneth Dale, Suite 251, 37537-7686, Allyland",
                "981 Eloy Rapid, Suite 415, 83964-2479, Port Kenny",
                "55163 Ernest Lodge, Suite 817, 20221, McCulloughchester",
                "37287 Paris Haven, Suite 316, 97656-6075, Gottliebchester",
                "5443 Daugherty Run, Apt. 916, 92896, East Bartholome",
                "006 Jakubowski Mount, Apt. 962, 14045, West Lawrence",
                "191 Stevie Island, Apt. 638, 70932-2776, Shaynachester",
                "700 Lindgren Oval, Suite 216, 47450-2634, Annamarieton",
                "85144 Hallie Field, Apt. 817, 47156-3921, Jerdefort",
                "7868 Curt Avenue, Suite 702, 95219, Adrianfort",
                "5803 Skyla Turnpike, Suite 376, 19889-2760, Delphiafurt",
                "9555 Elmo Springs, Suite 721, 65928-6097, Port Lilyanchester",
                "2730 Veda Mountains, Apt. 705, 81610, South Madelyntown",
                "125 Deckow Knolls, Apt. 834, 55919, North ",
                "99649 Madeline Walk, Apt. 371, 85445-5635, Antonettaborough",
                "0165 Gulgowski Club, Suite 197, 32119-3361, North Everettview",
                "855 Goyette Spring, Apt. 614, 98267, Anahiborough",
                "7276 Andrew Forge, Apt. 847, 69177-1589, New Dominiquechester",
                "292 Pollich Branch, Suite 387, 41351-7975, New Eldon",
                "81852 Weston Brook, Suite 637, 33835-3781, Port Isaiahfort",
                "9337 Rolfson Manors, Suite 765, 74420, Port Myronshire",
                "3360 Santos Burg, Apt. 305, 70003, Sawaynberg",
                "5147 Misael Causeway, Suite 850, 75495, Fritzbury",
                "03479 Nolan Pike, Apt. 426, 51929-4205, Lake Gerardo",
                "39558 Marjory Dam, Suite 337, 22373, Lindview, Wisconsin",
                "76476 Helena Harbor, Suite 070, 69615, Alexandrineview",
                "4517 Lebsack Shoal, Suite 291, 01861, East Johannaburgh",
                "571 Lindsey Island, Apt. 220, 91380-5078, North Gay",
                "187 Leffler Estate, Suite 243, 57997-0869, Hilllview",
            };
            return addresses[new Random().Next(addresses.Count)].ToUpper();
        }

        public static string CreateRandomCustomers() {
            List<string> customers = new() {
                "Nitzsche and Sons",
                "Schultz - Douglas",
                "Balistreri - Walter",
                "Schumm Inc",
                "Zboncak, Towne and Denesik",
                "Barrows, Kohler and Weissnat",
                "Emmerich and Sons",
                "Graham - Veum",
                "Doyle, Rath and Howe",
                "Schultz LLC",
                "Feest, Haley and Upton",
                "Fahey - Bernhard",
                "Kuhlman Inc",
                "McKenzie LLC",
                "Zemlak - Mueller",
                "Von, Heaney and Daniel",
                "Bechtelar Inc",
                "Rath and Sons",
                "Feil, Kilback and Haley",
                "Boyer - Abbott",
                "Mann - Trantow",
                "Feil, Carter and Schaden",
                "Marquardt - Boyle",
                "Donnelly Group",
                "Hagenes Inc",
                "Dooley - Green",
                "Bartell, Pfeffer and Jacobi",
                "Roberts Inc",
                "Mann, Emard and Johnston",
                "Willms - Volkman",
                "Beier Group",
                "Keeling - Stark",
                "Green - Hand",
                "Green - Predovic",
                "Schuppe LLC",
                "Hodkiewicz - Mraz",
                "Vandervort Group",
                "Skiles, Cummerata and Nicolas",
                "Beer Inc",
                "Crooks IncMann - Trantow",
                "Feil, Carter and Schaden",
                "Marquardt - Boyle",
                "Donnelly Group",
                "Hagenes Inc",
                "Dooley - Green",
                "Bartell, Pfeffer and Jacobi",
                "Roberts Inc",
                "Mann, Emard and Johnston",
                "Willms - Volkman",
                "Beier Group",
                "Keeling - Stark",
                "Green - Hand",
                "Green - Predovic",
                "Schuppe LLC",
                "Hodkiewicz - Mraz",
                "Vandervort Group",
                "Skiles, Cummerata and Nicolas",
                "Beer Inc",
                "Crooks Inc",
            };
            return customers[new Random().Next(customers.Count)].ToUpper();
        }

        public static string CreateRandomPhones() {
            List<string> phones = new() {
                "216-225-3268",
                "609-790-8062",
                "234-880-3925",
                "582-465-8638",
                "582-333-4824",
                "248-462-6749",
                "220-705-7901",
                "404-930-0672",
                "582-282-1230",
                "582-282-2457",
                "582-333-3698",
                "213-530-3580",
                "602-793-7631",
                "202-938-6679",
                "505-574-7992",
                "214-695-9090",
                "582-300-9276",
                "582-282-0704",
                "214-568-7608",
                "406-933-0135",
                "304-923-1193",
                "582-400-1351",
                "239-468-3516",
                "505-644-8768",
                "505-215-8459",
                "208-973-7374",
                "220-810-6831",
                "326-370-1804",
                "505-635-2346",
                "582-400-6729",
            };
            return phones[new Random().Next(phones.Count)].ToUpper();
        }

        public static string CreateRandomPersonsInCharge() {
            List<string> personsInCharge = new() {
                "Terrell",
                "Columbus",
                "Torey",
                "Rhianna",
                "Marquis",
                "Amya",
                "Laurel",
                "Dion",
                "Mark",
                "Kirk",
                "Keven",
                "Mervin",
                "Yolanda",
                "Bobbie",
                "Michel",
                "Sydnee",
                "Linnea",
                "Paige",
                "Estella",
                "Horace",
                "Casandra",
                "Josh",
                "Burnice",
                "Payton",
                "Kale",
                "Vladimir",
                "Myrna",
                "Tanya",
                "Giles",
                "Dale",
            };
            return personsInCharge[new Random().Next(personsInCharge.Count)].ToUpper();
        }

        public static string CreateRandomOccupations() {
            List<string> occupations = new() {
                "cutter",
                "barber",
                "rental clerk",
                "history teacher",
                "financial analyst",
                "heat treating equipment setter",
                "cleaner",
                "sales manager",
                "painting worker",
                "laundry worker",
                "natural sciences manager",
                "paper goods machine setter",
                "hand packager",
                "occupational health and safety specialist",
                "medical laboratory technologist",
                "freight mover",
                "shipmate",
                "butcher",
                "home management advisor",
                "lodging manager",
                "occupational therapist",
                "order filler",
                "data entry keyer",
                "accountant",
                "probation officer",
                "safe repairer",
                "industrial production manager",
                "obstetrician",
                "ship captain",
                "sheet metal worker",
                "production clerk",
                "metal pickling operator",
                "civil engineering technician",
                "nuclear power reactor operator",
                "health and safety engineer",
                "brazer",
                "team assembler",
                "manicurist",
                "metal caster",
                "petroleum engineer",
                "scout leader",
                "set designer",
                "locker room attendant",
                "power distributor",
                "coatroom attendant",
                "aerospace engineering technician",
                "mapping technician",
                "paralegal",
                "gaming manager",
                "locksmith",
            };
            return occupations[new Random().Next(occupations.Count)].ToUpper();
        }

        public static string CreateRandomDrivers() {
            List<string> drivers = new() {
                "Gaston Smithers",
                "Arin Flesher",
                "Ivyonna Wenner",
                "Sirius Rhyne",
                "Martell Horgan",
                "Aliza Peralta",
                "Jazlene Bostwick",
                "Alise Pape",
                "Jaliah Brenneman ",
            };
            return drivers[new Random().Next(drivers.Count)].ToUpper();
        }

        public static List<string> CreateGenders() {
            return (List<string>)(new() {
                "male",
                "female",
                "other",
            });
        }

    }

}