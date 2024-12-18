const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

dotenv.config(); // Charge les variables d'environnement

const uri = process.env.ATLAS_URI || "";

let db; // Variable pour stocker la base de données

const connectDB = async () => {
    try {
        const client = new MongoClient(uri, {});
        await client.connect();
        db = client.db("DB");
        console.log("Connected to Database");
        await mongoose.connect(uri, {
            dbName: "DB",
        });
    } catch (err) {
        console.error("Please connect Database: " + err);
    }
};

jest.mock("mongoose", () => ({
    connect: jest.fn(),
}));

jest.mock("mongodb", () => {
    const mockClientInstance = {
        connect: jest.fn(),
        db: jest.fn().mockReturnValue({
            collection: jest.fn(),
        }),
    };
    const mockMongoClient = jest.fn(() => mockClientInstance);
    return {
        MongoClient: mockMongoClient,
    };
});

describe("Database Connection Tests", () => {
    let mockClientInstance;

    beforeEach(() => {
        mockClientInstance = new MongoClient(); 
    });

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    test("connectDB - connecte correctement à MongoDB", async () => {
        mongoose.connect.mockResolvedValue();
        mockClientInstance.connect.mockResolvedValue();

        await connectDB();

        // Vérifie que MongoClient a été initialisé avec le bon URI
        expect(MongoClient).toHaveBeenCalledWith(uri, {});
        expect(mockClientInstance.connect).toHaveBeenCalled();

        // Vérifie que la base de données est définie
        expect(db).toBeDefined();
        expect(db.collection).toBeDefined();

        // Vérifie que Mongoose est appelé avec les bonnes options
        expect(mongoose.connect).toHaveBeenCalledWith(uri, {
            dbName: "DB",
        });
    });

  

    test("connectDB - vérifie les logs en cas de connexion réussie", async () => {
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        mongoose.connect.mockResolvedValue();
        mockClientInstance.connect.mockResolvedValue();

        await connectDB();

        // Vérifie que le log de connexion est affiché
        expect(consoleLogSpy).toHaveBeenCalledWith("Connected to Database");

        consoleLogSpy.mockRestore();
    });

    test("connectDB - MongoClient configuré avec des options spécifiques", async () => {
        const options = { useNewUrlParser: true, useUnifiedTopology: true };
        const mockClientInstanceWithOptions = new MongoClient(uri, options);
        mockClientInstanceWithOptions.connect.mockResolvedValue();

        jest.clearAllMocks(); 

        await connectDB();

        // Vérifie que MongoClient a été appelé avec les bonnes options
        expect(MongoClient).toHaveBeenCalledWith(uri, {});
        expect(mockClientInstance.connect).toHaveBeenCalled();
    });
});