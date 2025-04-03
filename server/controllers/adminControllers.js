const userModel = require("../model/userModel")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");



const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Verify if the user is an admin
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied, not an admin" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });

        res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const adminProfile = async (req, res) => {
    try {
        const adminId = req.user._id; // Extract admin ID from the authenticated user
        const admin = await userModel.findById(adminId).select("-password"); // Exclude password

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (admin.role !== "admin") {
            return res.status(403).json({ message: "Access denied, not an admin" });
        }

        res.status(200).json(admin);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};





const createManager = async (req, res) => {
    try {
        //Ensure only admin can create a manager
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied, only admins can add managers" });
        }

        const { name, email, phone, password } = req.body;

        //Validate input fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //Check if manager already exists
        const existingManager = await userModel.findOne({ email });
        if (existingManager) {
            return res.status(400).json({ message: "Manager with this email already exists" });
        }

        //Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new manager
        const newManager = new userModel({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "manager",  // Set role to "manager"
        });

        // Save to database
        const savedManager = await newManager.save();

        return res.status(201).json({
            message: "Manager created successfully",
            manager: {
                id: savedManager._id,
                name: savedManager.name,
                email: savedManager.email,
                phone: savedManager.phone,
                role: savedManager.role,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};




module.exports = { adminLogin, createManager, adminProfile,  }

