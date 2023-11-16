package sqlite

import (
	"fmt"
	"time"

	"github.com/gofrs/uuid"
)

func AddNewCookie(userId string) string {
	//cookie id is a UUID
	cookieId, err := uuid.NewV4()
	if err != nil {
		fmt.Println("Error generating new uuid")
		return ""
	}
	// set the cookie to expire in 7 days
	expires := time.Now().AddDate(0, 0, 7)

	//make a sql statement for inserting a new cookie to cookies table
	sqlStatement := `
	INSERT INTO cookies (userId, cookieId, expires)
	VALUES (?, ?, ?);
	`
	//execute the sql statement
	_, err = Db.Exec(sqlStatement, userId, cookieId.String(), expires)
	if err != nil {
		fmt.Println(err)
		return ""
	}
	fmt.Println("Cookie successfully inserted into the database.")
	//return the UUID in string format
	return cookieId.String()
}
func DeleteCookie(cookieId string) string {
	sqlStatement := `
	DELETE FROM cookies WHERE cookieId = ?
	`
	result, err := Db.Exec(sqlStatement, cookieId)
	if err != nil {
		fmt.Println(err)
	}
	res, err := result.RowsAffected()
	if err != nil {
		fmt.Println(err)
	}
	if res > 0 {
		fmt.Printf("%d deleted from the database", res)
		return "success"
	}
	return "error"
}

func IsCookieInDatabase(userId string) string {
	newid := ""
	rows, err := Db.Query("SELECT cookieId FROM cookies WHERE userId = ?", userId)
	defer rows.Close()
	if err != nil {
		fmt.Println(err)
	}else {
		if rows.Next() {
			err = rows.Scan(&newid)
			if err != nil {
				fmt.Println(err)
			}else {
				return newid
			}
		}
	}
	return ""
}