/**
 * 3070. Relative Distance   ·   Easy   ·   Exercism
 *
 * Your task is to determine the degree of separation between two individuals
 * in a family tree. This is similar to the pop culture idea that every
 * Hollywood actor is [within six degrees of Kevin Bacon][six-bacons].
 *
 * - You will be given an input, with all parent names and their children.
 * - Each name is unique, a child can have one or two parents.
 * - The degree of separation is defined as the shortest number of connections
 *   from one person to another.
 * - If two individuals are not connected, return a value that represents "no
 *   known relationship."
 * Please see the test cases for the actual implementation.
 *
 * Given the following family tree:
 *
 * The degree of separation between Tariq and Uma is 2 (Tariq → Isla → Uma).
 * There's no known relationship between Isla and Kevin, as there is no
 * connection in the given data. The degree of separation between Uma and Isla
 * is 1.
 *
 * exercism/note Isla and Tariq are siblings and have a separation of 1.
 * Similarly, this implementation would report a separation of 2 from you to
 * your father's brother.
 *
 * [six-bacons]: https://en.wikipedia.org/wiki/SixDegreesofKevinBacon
 *
 * Example 1:
 *   Input:  familyTree = {"Vera":["Tomoko"],"Tomoko":["Aditi"]}, personA = "Vera", personB = "Tomoko"
 *   Output: 1
 *
 * Example 2:
 *   Input:  familyTree = {"Dalia":["Olga","Yassin"]}, personA = "Olga", personB = "Yassin"
 *   Output: 1
 *
 * Example 3:
 *   Input:  familyTree = {"Khadija":["Mateo"],"Mateo":["Rami"]}, personA = "Khadija", personB = "Rami"
 *   Output: 2
 *
 * Example 4:
 *   Input:  familyTree = {"Aiko":["Bao","Carlos"],"Bao":["Dalia","Elias"],"Carlos":["Fatima","Gustavo"],"Dalia":["Hassan","Isla"],"Elias":["Javier"],"Fatima":["Khadija","Liam"],"Gustavo":["Mina"],"Hassan":["Noah","Olga"],"Isla":["Pedro"],"Javier":["Quynh","Ravi"],"Khadija":["Sofia"],"Liam":["Tariq","Uma"],"Mina":["Viktor","Wang"],"Noah":["Xiomara"],"Olga":["Yuki"],"Pedro":["Zane","Aditi"],"Quynh":["Boris"],"Ravi":["Celine"],"Sofia":["Diego","Elif"],"Tariq":["Farah"],"Uma":["Giorgio"],"Viktor":["Hana","Ian"],"Wang":["Jing"],"Xiomara":["Kaito"],"Yuki":["Leila"],"Zane":["Mateo"],"Aditi":["Nia"],"Boris":["Oscar"],"Celine":["Priya"],"Diego":["Qi"],"Elif":["Rami"],"Farah":["Sven"],"Giorgio":["Tomoko"],"Hana":["Umar"],"Ian":["Vera"],"Jing":["Wyatt"],"Kaito":["Xia"],"Leila":["Yassin"],"Mateo":["Zara"],"Nia":["Antonio"],"Oscar":["Bianca"],"Priya":["Cai"],"Qi":["Dimitri"],"Rami":["Ewa"],"Sven":["Fabio"],"Tomoko":["Gabriela"],"Umar":["Helena"],"Vera":["Igor"],"Wyatt":["Jun"],"Xia":["Kim"],"Yassin":["Lucia"],"Zara":["Mohammed"]}, personA = "Dimitri", personB = "Fabio"
 *   Output: 9
 *
 * Example 5:
 *   Input:  familyTree = {"Aiko":["Bao","Carlos"],"Bao":["Dalia","Elias"],"Carlos":["Fatima","Gustavo"],"Dalia":["Hassan","Isla"],"Elias":["Javier"],"Fatima":["Khadija","Liam"],"Gustavo":["Mina"],"Hassan":["Noah","Olga"],"Isla":["Pedro"],"Javier":["Quynh","Ravi"],"Khadija":["Sofia"],"Liam":["Tariq","Uma"],"Mina":["Viktor","Wang"],"Noah":["Xiomara"],"Olga":["Yuki"],"Pedro":["Zane","Aditi"],"Quynh":["Boris"],"Ravi":["Celine"],"Sofia":["Diego","Elif"],"Tariq":["Farah"],"Uma":["Giorgio"],"Viktor":["Hana","Ian"],"Wang":["Jing"],"Xiomara":["Kaito"],"Yuki":["Leila"],"Zane":["Mateo"],"Aditi":["Nia"],"Boris":["Oscar"],"Celine":["Priya"],"Diego":["Qi"],"Elif":["Rami"],"Farah":["Sven"],"Giorgio":["Tomoko"],"Hana":["Umar"],"Ian":["Vera"],"Jing":["Wyatt"],"Kaito":["Xia"],"Leila":["Yassin"],"Mateo":["Zara"],"Nia":["Antonio"],"Oscar":["Bianca"],"Priya":["Cai"],"Qi":["Dimitri"],"Rami":["Ewa"],"Sven":["Fabio"],"Tomoko":["Gabriela"],"Umar":["Helena"],"Vera":["Igor"],"Wyatt":["Jun"],"Xia":["Kim"],"Yassin":["Lucia"],"Zara":["Mohammed"]}, personA = "Lucia", personB = "Jun"
 *   Output: 14
 *
 * Example 6:
 *   Input:  familyTree = {"Aiko":["Bao","Carlos"],"Bao":["Dalia"],"Carlos":["Fatima","Gustavo"],"Dalia":["Hassan","Isla"],"Fatima":["Khadija","Liam"],"Gustavo":["Mina"],"Hassan":["Noah","Olga"],"Isla":["Pedro"],"Javier":["Quynh","Ravi"],"Khadija":["Sofia"],"Liam":["Tariq","Uma"],"Mina":["Viktor","Wang"],"Noah":["Xiomara"],"Olga":["Yuki"],"Pedro":["Zane","Aditi"],"Quynh":["Boris"],"Ravi":["Celine"],"Sofia":["Diego","Elif"],"Tariq":["Farah"],"Uma":["Giorgio"],"Viktor":["Hana","Ian"],"Wang":["Jing"],"Xiomara":["Kaito"],"Yuki":["Leila"],"Zane":["Mateo"],"Aditi":["Nia"],"Boris":["Oscar"],"Celine":["Priya"],"Diego":["Qi"],"Elif":["Rami"],"Farah":["Sven"],"Giorgio":["Tomoko"],"Hana":["Umar"],"Ian":["Vera"],"Jing":["Wyatt"],"Kaito":["Xia"],"Leila":["Yassin"],"Mateo":["Zara"],"Nia":["Antonio"],"Oscar":["Bianca"],"Priya":["Cai"],"Qi":["Dimitri"],"Rami":["Ewa"],"Sven":["Fabio"],"Tomoko":["Gabriela"],"Umar":["Helena"],"Vera":["Igor"],"Wyatt":["Jun"],"Xia":["Kim"],"Yassin":["Lucia"],"Zara":["Mohammed"]}, personA = "Wyatt", personB = "Xia"
 *   Output: 12
 *
 * Pattern:   Read the rule carefully, then write it out
 * Target:    Not stated for this set
 * Source:    Exercism problem specifications · MIT
 */
export function degreeOfSeparation(familyTree: object, personA: string, personB: string): number {
  throw new Error('Not implemented');
}
