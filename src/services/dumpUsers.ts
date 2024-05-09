import { User } from "../api/models";

const fs = require("fs");

// Method to insert users into the database
async function insertUsers() {
  console.log("dump started ==== ");
  try {
    // Read the JSON file
    const data = fs.readFileSync("src/services/users.json", "utf8");
    const users = JSON.parse(data);

    // Transform and insert the data
    const insertPromises = users.map((user: any) => {
      const userDoc = new User({
        employeeID: user["EMP ID"].toString(), // Make sure employeeID is a string
        name: user["NAME"],
        account: user["Account"],
        supportingAccount: user["Supporting Account"] || undefined, // Use undefined to avoid setting the field if it does not exist
        projects: user["Project"]
          .split(", ")
          .map((project: any) => project.trim()), // Split projects by comma and trim
        technicalRole: user["Role"],
        designation: user["Designation"],
      });
      return userDoc.save(); // Save the document and return the promise
    });

    // Wait for all insertions to complete
    await Promise.all(insertPromises);

    console.log("All users have been inserted");
  } catch (err) {
    console.error("Error inserting users", err);
  }
}
export default insertUsers;
