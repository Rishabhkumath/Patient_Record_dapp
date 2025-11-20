// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedicalRecords {
    address public admin;
    
    struct Patient {
        address walletAddress;
        string name;
        uint256 dateOfBirth;
        string gender;
        string publicKey;
        bool exists;
    }
    
    struct MedicalRecord {
        uint256 recordId;
        address patientAddress;
        string diagnosis;
        string treatment;
        string medication;
        string notes;
        uint256 date;
        address doctorAddress;
    }
    
    struct Doctor {
        address walletAddress;
        string name;
        string specialization;
        string licenseNumber;
        bool exists;
        bool isAuthorized;
    }
    
    // Mappings
    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    mapping(uint256 => MedicalRecord) public medicalRecords;
    mapping(address => uint256[]) public patientRecords;
    mapping(address => mapping(address => bool)) public authorizedAccess;
    
    uint256 public recordCount;
    uint256 public patientCount;
    uint256 public doctorCount;
    
    // Events
    event PatientRegistered(address indexed patientAddress, string name);
    event DoctorRegistered(address indexed doctorAddress, string name, string specialization);
    event DoctorAuthorized(address indexed doctorAddress, bool isAuthorized);
    event RecordAdded(uint256 indexed recordId, address indexed patientAddress, address indexed doctorAddress);
    event AccessGranted(address indexed patientAddress, address indexed doctorAddress);
    event AccessRevoked(address indexed patientAddress, address indexed doctorAddress);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyDoctor() {
        require(doctors[msg.sender].exists && doctors[msg.sender].isAuthorized, "Only authorized doctors can perform this action");
        _;
    }
    
    modifier patientExists(address _patientAddress) {
        require(patients[_patientAddress].exists, "Patient does not exist");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        recordCount = 0;
        patientCount = 0;
        doctorCount = 0;
    }
    
    // Patient Registration
    function registerPatient(
        string memory _name,
        uint256 _dateOfBirth,
        string memory _gender,
        string memory _publicKey
    ) external {
        require(!patients[msg.sender].exists, "Patient already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        patients[msg.sender] = Patient({
            walletAddress: msg.sender,
            name: _name,
            dateOfBirth: _dateOfBirth,
            gender: _gender,
            publicKey: _publicKey,
            exists: true
        });
        
        patientCount++;
        emit PatientRegistered(msg.sender, _name);
    }
    
    // Doctor Registration (Admin only)
    function registerDoctor(
        address _doctorAddress,
        string memory _name,
        string memory _specialization,
        string memory _licenseNumber
    ) external onlyAdmin {
        require(!doctors[_doctorAddress].exists, "Doctor already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        doctors[_doctorAddress] = Doctor({
            walletAddress: _doctorAddress,
            name: _name,
            specialization: _specialization,
            licenseNumber: _licenseNumber,
            exists: true,
            isAuthorized: true
        });
        
        doctorCount++;
        emit DoctorRegistered(_doctorAddress, _name, _specialization);
    }
    
    // Authorize/Deauthorize Doctor
    function setDoctorAuthorization(address _doctorAddress, bool _isAuthorized) external onlyAdmin {
        require(doctors[_doctorAddress].exists, "Doctor not registered");
        doctors[_doctorAddress].isAuthorized = _isAuthorized;
        emit DoctorAuthorized(_doctorAddress, _isAuthorized);
    }
    
    // Add Medical Record
    function addMedicalRecord(
        address _patientAddress,
        string memory _diagnosis,
        string memory _treatment,
        string memory _medication,
        string memory _notes
    ) external onlyDoctor patientExists(_patientAddress) {
        require(authorizedAccess[_patientAddress][msg.sender], "Not authorized to add records for this patient");
        
        recordCount++;
        
        MedicalRecord memory newRecord = MedicalRecord({
            recordId: recordCount,
            patientAddress: _patientAddress,
            diagnosis: _diagnosis,
            treatment: _treatment,
            medication: _medication,
            notes: _notes,
            date: block.timestamp,
            doctorAddress: msg.sender
        });
        
        medicalRecords[recordCount] = newRecord;
        patientRecords[_patientAddress].push(recordCount);
        
        emit RecordAdded(recordCount, _patientAddress, msg.sender);
    }
    
    // Grant Access to Doctor
    function grantAccess(address _doctorAddress) external patientExists(msg.sender) {
        require(doctors[_doctorAddress].exists, "Doctor not registered");
        require(doctors[_doctorAddress].isAuthorized, "Doctor not authorized");
        
        authorizedAccess[msg.sender][_doctorAddress] = true;
        emit AccessGranted(msg.sender, _doctorAddress);
    }
    
    // Revoke Access from Doctor
    function revokeAccess(address _doctorAddress) external patientExists(msg.sender) {
        authorizedAccess[msg.sender][_doctorAddress] = false;
        emit AccessRevoked(msg.sender, _doctorAddress);
    }
    
    // Get Patient Details
    function getPatient(address _patientAddress) external view returns (
        string memory name,
        uint256 dateOfBirth,
        string memory gender,
        string memory publicKey,
        bool exists
    ) {
        Patient memory patient = patients[_patientAddress];
        return (patient.name, patient.dateOfBirth, patient.gender, patient.publicKey, patient.exists);
    }
    
    // Get Doctor Details
    function getDoctor(address _doctorAddress) external view returns (
        string memory name,
        string memory specialization,
        string memory licenseNumber,
        bool exists,
        bool isAuthorized
    ) {
        Doctor memory doctor = doctors[_doctorAddress];
        return (doctor.name, doctor.specialization, doctor.licenseNumber, doctor.exists, doctor.isAuthorized);
    }
    
    // Get Medical Record
    function getMedicalRecord(uint256 _recordId) external view returns (
        address patientAddress,
        string memory diagnosis,
        string memory treatment,
        string memory medication,
        string memory notes,
        uint256 date,
        address doctorAddress
    ) {
        MedicalRecord memory record = medicalRecords[_recordId];
        require(
            record.patientAddress == msg.sender || 
            (doctors[msg.sender].exists && authorizedAccess[record.patientAddress][msg.sender]),
            "Not authorized to view this record"
        );
        
        return (
            record.patientAddress,
            record.diagnosis,
            record.treatment,
            record.medication,
            record.notes,
            record.date,
            record.doctorAddress
        );
    }
    
    // Get Patient's Record IDs
    function getPatientRecordIds(address _patientAddress) external view returns (uint256[] memory) {
        require(
            _patientAddress == msg.sender || 
            (doctors[msg.sender].exists && authorizedAccess[_patientAddress][msg.sender]),
            "Not authorized to view patient records"
        );
        return patientRecords[_patientAddress];
    }
    
    // Check if access is granted
    function isAccessGranted(address _patientAddress, address _doctorAddress) external view returns (bool) {
        return authorizedAccess[_patientAddress][_doctorAddress];
    }
    
    // Get contract statistics
    function getStats() external view returns (uint256, uint256, uint256) {
        return (patientCount, doctorCount, recordCount);
    }
}