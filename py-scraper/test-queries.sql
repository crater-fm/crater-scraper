/* Select all setlists which contain the desired artist */
CREATE VIEW Q_Artist_in_Setlist AS
SELECT
    Track_number, Setlist_Name AS Setlist_Name_2
FROM
    Setlist
WHERE
    Artist_name = "Joni Mitchell";

/* Select all setlists which contain the desired artist */
SELECT 
    *
FROM
    Setlist
INNER JOIN Q_Artist_in_Setlist
    ON Q_Artist_in_Setlist.Setlist_Name_2 = Setlist.Setlist_Name;

lead = 1
lag = -1

SELECT 
    *
FROM
    Setlist
INNER JOIN Q_Artist_in_Setlist
    ON Q_Artist_in_Setlist.Setlist_Name_2 = Setlist.Setlist_Name
    ON Q_Artist_in_Setlist.(Track_number + lead) = Setlist.Track_number



/* Based on a chosen Artist, find all tracks by that Artist */
CREATE VIEW Q_Track_per_Artist AS
SELECT
    *
FROM
    Setlist
WHERE
    Artist_name = "Joni Mitchell"

/* Based on a selected Artist, find adjacent tracks in setlists where that Artist was played */

SELECT
    Setlist_name
FROM
    Setlist
INNER JOIN Q_Track_per_Artist
    ON Q_Track_per_Artist.Track_name = Setlist.Track_Name