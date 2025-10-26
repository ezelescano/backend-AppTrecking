/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único del usuario
 *         user_name:
 *           type: string
 *         full_name:
 *           type: string
 *           nullable: true
 *         avatar_url:
 *           type: string
 *           nullable: true
 *         role:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         birth_date:
 *           type: string
 *           format: date
 *           nullable: true
 *         age:
 *           type: integer
 *           nullable: true
 *       required:
 *         - id
 *         - user_name
 *         - role
 *         - gender
 * 
 *     UserDTO:
 *       type: object
 *       properties:
 *         user_name:
 *           type: string
 *         full_name:
 *           type: string
 *           nullable: true
 *         avatar_url:
 *           type: string
 *           nullable: true
 *         role:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         birth_date:
 *           type: string
 *           format: date
 *           nullable: true
 *       required:
 *         - user_name
 *         - role
 *         - gender
    */

export default {};