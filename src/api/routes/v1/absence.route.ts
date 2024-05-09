import express, { Router } from "express";
import auth from "../../middlewares/auth";
import validate from "../../middlewares/validate";
import * as absenceValidation from "../../validations/index";
import * as absenceController from "../../controllers/absence.controller";

const router: Router = express.Router();

router
  .route("/")
  .post(
    validate(absenceValidation.createAbsence),
    absenceController.createAbsence
  )
  .get(validate(absenceValidation.updateAbsence), absenceController.getAbsence);

export default router;

/**
 * @swagger
 * tags:
 *   name: Absences
 *   description: Absence management and retrieval
 */

/**
 * @swagger
 * /absences:
 *   post:
 *     summary: Mark a new absence
 *     description: Allows a user to record a day they were absent.
 *     tags: [Absences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - date
 *               - reason
 *             properties:
 *               user:
 *                 type: string
 *                 description: User ID of the user marking the absence
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of absence
 *               reason:
 *                 type: string
 *                 description: Reason for absence
 *             example:
 *               user: 507f191e810c19729de860ea
 *               date: '2021-08-21'
 *               reason: 'Sick leave'
 *     responses:
 *       "201":
 *         description: Absence record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AbsenceEntry'
 *       "400":
 *         description: Invalid request parameters
 *       "401":
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /absences:
 *   get:
 *     summary: Get all absences
 *     description: Retrieves a list of all absences, optionally filtered by user and/or month and year.
 *     tags: [Absences]
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: User ID to filter absences
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month to filter absences
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           minimum: 2021
 *         description: Year to filter absences
 *     responses:
 *       "200":
 *         description: A list of absences
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AbsenceEntry'
 *       "401":
 *         description: Unauthorized access
 *       "500":
 *         description: Server error
 */

/**
 * @swagger
 * /absences/{id}:
 *   patch:
 *     summary: Update an absence record
 *     description: Updates details about an absence record. Only the user who created the record or an admin can update it.
 *     tags: [Absences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the absence record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The new date of the absence
 *               reason:
 *                 type: string
 *                 description: The new reason for the absence
 *             example:
 *               date: '2021-08-23'
 *               reason: 'Attending conference'
 *     responses:
 *       "200":
 *         description: Absence updated successfully
 *       "400":
 *         description: Invalid request parameters
 *       "401":
 *         description: Unauthorized access
 *       "404":
 *         description: Absence not found
 *       "500":
 *         description: Server error
 */

/**
 * @swagger
 * /absences/{id}:
 *   delete:
 *     summary: Delete an absence record
 *     description: Deletes an absence record. Only the user who created the record or an admin can delete it.
 *     tags: [Absences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the absence record to delete
 *     responses:
 *       "204":
 *         description: Absence deleted successfully
 *       "401":
 *         description: Unauthorized access
 *       "404":
 *         description: Absence not found
 *       "500":
 *         description: Server error
 */
