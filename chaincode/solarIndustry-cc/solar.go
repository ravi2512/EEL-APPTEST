package main

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
	//"strconv"
	//"time"
)

type SmartContract struct {
}

type Users struct {
	UserId   string `json:"user_id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Type     string `json:"user_type"`
}

type DispatchDetails struct {
	InventoryId           string `json:"inventory_id"`
	Quantity              string `json:"dispatched_quantity"`
	VehicleNumber         string `json:"vehicle_number"`
	Date                  string `json:"dispatched_date"`
	ETA                   string `json:"eta"`
	Remark                string `json:"supplier_remark"`
	EscalationStatus      string `json:"escalation_status"`
	EscalationRemark      string `json:"escalation_remark"`
	EscalationDoneBy      string `json:"escalation_done_by"`
	AcknowledgementBySIIL string `json:"acknowledgement_by_siil"`
	RemarkBySIIL          string `json:"remark_by_siil"`
	DriverName            string `json:"driver_name"`
	DriverContactNo       string `json:"driver_contact_no"`
	StockAtSupplierEnd    string `json:"stock_at_supplier_end"`
}

type AcknowledgementDetails struct {
	InventoryId string `json:"inventory_id"`
	Status      string `json:"acknowledgement_status"`
	Remark      string `json:"acknowledgement_remark"`
	DoneBy      string `json:"acknowledgement_done_by"`
}

type WeeklyPlanDetails struct {
	InventoryId string `json:"inventory_id"`
	Day1        string `json:"day_1"`
	Day2        string `json:"day_2"`
	Day3        string `json:"day_3"`
	Day4        string `json:"day_4"`
	Day5        string `json:"day_5"`
	Day6        string `json:"day_6"`
	Day7        string `json:"day_7"`
}

type SyncTime struct {
	SyncId   string `json:"sync_id"`
	SyncTime string `json:"sync_time"`
}

type Inventory struct {
	InventoryId         string                 `json:"inventory_id"`
	PurchaseOrder       string                 `json:"purchase_order"`
	PartNo              string                 `json:"part_no"`
	Date                string                 `json:"date"`
	PartDescription     string                 `json:"part_description"`
	UOM                 string                 `json:"uom"`
	MaxStock            string                 `json:"max_stock"`
	MinStock            string                 `json:"min_stock"`
	OpeningStock        string                 `json:"opening_stock"`
	ConsumptionPerDay   string                 `json:"consumption_per_day"`
	ConsumptionPer3d    string                 `json:"consumption_per_3d"`
	ToSupply            string                 `json:"to_supply"`
	Criticality         string                 `json:"criticalty"`
	Remark              string                 `json:"remark"`
	ColorCode           string                 `json:"color_code"`
	Coverage            string                 `json:"coverage"`
	Unaccounted         string                 `json:"unaccounted"`
	Inventorytype       string                 `json:"inventory_type"`
	Vendor              string                 `json:"vendor"`
	VendorId            string                 `json:"vendor_id"`
	AcknowledgementInfo AcknowledgementDetails `json:"acknowledgement_details"`
	EntryDate           string                 `json:"entry_date"`
	WeeklyPlan          WeeklyPlanDetails      `json:"weekly_plan"`
	DispatchInfo        DispatchDetails        `json:"dispatch_details"`
}

/*
 * The Init method *
 called when the Smart Contract is instantiated by the network
*/
func (s *SmartContract) Init(stub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Init Ledger method *
 called when the Smart Contract is instantiated by the network
*/
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	users := []Users{
		Users{UserId: "admin", Name: "Admin", Email: "ravi.kumar@solargroup.com", Password: "Admin@123", Type: "Admin"}}

	// userAsBytes, _ := json.Marshal(users)
	// APIstub.PutState(users.UserId, userAsBytes)
	// fmt.Println("Added \n", users)

	for _, user := range users {
		userAsBytes, _ := json.Marshal(user)
		APIstub.PutState(user.UserId, userAsBytes)
		fmt.Println("Added \n", user)
	}

	return shim.Success(nil)
}

/*
 *Invoke Method *
 called when client sends a transaction proposal.
*/
func (s *SmartContract) Invoke(stub shim.ChaincodeStubInterface) sc.Response {
	// Retrieve the requested Smart Contract function and arguments
	fmt.Printf("Invoked\n")
	function, args := stub.GetFunctionAndParameters()

	fmt.Printf("Call Function %s and pass Arguments %s\n", function, args)
	//Check that this request was initiated by the Main Org (Educhain)
	//isMainOrg, err := MainOrg(stub)
	if function == "addInventory" {
		return s.addInventory(stub, args)
	} else if function == "getInventory" {
		return s.getInventory(stub, args)
	} else if function == "getAllInventory" {
		return s.getAllInventory(stub, args)
	} else if function == "initLedger" {
		return s.initLedger(stub, args)
	} else if function == "createUser" {
		return s.createUser(stub, args)
	} else if function == "queryData" {
		return s.queryData(stub, args)
	} else if function == "updateEscalation" {
		return s.updateEscalationDetails(stub, args)
	} else if function == "updateAcknowledgement" {
		return s.updateAcknowledgementDetails(stub, args)
	} else if function == "updateEscalationAcknowledgement" {
		return s.updateEscalationAcknowledgement(stub, args)
	} else if function == "updateSyncTime" {
		return s.UpdateSyncTime(stub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

/*
 *createUser Method *
 called when client sends a transaction proposal.
*/
func (s *SmartContract) createUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5 parameter")
	}

	//var id = strconv.Itoa(random(0, 100))
	var user = Users{UserId: args[0], Name: args[1], Email: args[2], Password: args[3], Type: args[4]}

	userAsBytes, _ := json.Marshal(user)
	err := APIstub.PutState(args[0], userAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record User catch: %s", args[0]))
	}

	return shim.Success(nil)
}

func (s *SmartContract) addInventory(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	fmt.Printf("Add Inventory to the ledger ...\n")
	fmt.Println(len(args))
	if len(args) != 29 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 30:")
	}

	inventoryId := "inventory-" + args[28]
	var inventory = Inventory{
		InventoryId:         inventoryId,
		PurchaseOrder:       args[1],
		PartNo:              args[2],
		Date:                args[0],
		PartDescription:     args[3],
		UOM:                 args[4],
		MaxStock:            args[5],
		MinStock:            args[6],
		OpeningStock:        args[7],
		ConsumptionPerDay:   args[8],
		ConsumptionPer3d:    args[9],
		ToSupply:            args[10],
		Criticality:         args[11],
		Remark:              args[12],
		ColorCode:           args[13],
		Coverage:            args[14],
		Unaccounted:         args[15],
		Inventorytype:       args[16],
		Vendor:              args[17],
		VendorId:            args[19],
		AcknowledgementInfo: AcknowledgementDetails{InventoryId: inventoryId, Status: args[18]},
		EntryDate:           args[27],
		WeeklyPlan:          WeeklyPlanDetails{InventoryId: inventoryId, Day1: args[20], Day2: args[21], Day3: args[22], Day4: args[23], Day5: args[24], Day6: args[25], Day7: args[26]},
		DispatchInfo:        DispatchDetails{InventoryId: inventoryId}}

	inventoryAsBytes, _ := json.Marshal(inventory)
	stub.PutState(inventoryId, inventoryAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) UpdateSyncTime(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Printf("update SyncTime to the ledger ...\n")
	if len(args) != 1 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 1")
	}

	syncId := "sync-1"
	var sync = SyncTime{
		SyncId:   syncId,
		SyncTime: args[0]}

	syncAsBytes, _ := json.Marshal(sync)
	stub.PutState(syncId, syncAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) getInventory(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	fmt.Printf("Get Inventory from ledger ...\n")
	if len(args) != 1 {
		return shim.Error("InvalidArgumentError: Incorrect number of arguments. Expecting 1")
	}

	inventoryAsBytes, _ := stub.GetState(args[0])

	return shim.Success(inventoryAsBytes)
}

func (s *SmartContract) updateEscalationDetails(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) < 12 {
		return shim.Error("Incorrect number of arguments. Expecting 12")
	}

	var inventoryDetails Inventory
	err := getStateAndUnmarshal(stub, args[0], &inventoryDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("getStateAndUnmarshalError: %s", err))
	}

	inventoryDetails.DispatchInfo.Quantity = args[1]
	inventoryDetails.DispatchInfo.VehicleNumber = args[2]
	inventoryDetails.DispatchInfo.Date = args[3]
	inventoryDetails.DispatchInfo.Remark = args[4]
	inventoryDetails.DispatchInfo.EscalationRemark = args[5]
	inventoryDetails.DispatchInfo.EscalationStatus = args[6]
	inventoryDetails.DispatchInfo.EscalationDoneBy = args[7]
	inventoryDetails.DispatchInfo.ETA = args[8]
	inventoryDetails.DispatchInfo.DriverName = args[9]
	inventoryDetails.DispatchInfo.DriverContactNo = args[10]
	inventoryDetails.DispatchInfo.StockAtSupplierEnd = args[11]

	err = marshalAndPutState(stub, args[0], inventoryDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("marshalAndPutStateError: %s", err))
	}

	fmt.Printf("Updated Escalation Status\n\n")

	return shim.Success(nil)
}

func (s *SmartContract) updateEscalationAcknowledgement(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) < 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	var inventoryDetails Inventory
	err := getStateAndUnmarshal(stub, args[0], &inventoryDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("getStateAndUnmarshalError: %s", err))
	}

	inventoryDetails.DispatchInfo.AcknowledgementBySIIL = args[1]
	inventoryDetails.DispatchInfo.RemarkBySIIL = args[2]

	err = marshalAndPutState(stub, args[0], inventoryDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("marshalAndPutStateError: %s", err))
	}

	fmt.Printf("Updated Escalation Status\n\n")

	return shim.Success(nil)
}

func (s *SmartContract) updateAcknowledgementDetails(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) < 4 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	var inventoryDetails Inventory
	err := getStateAndUnmarshal(stub, args[0], &inventoryDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("getStateAndUnmarshalError: %s", err))
	}

	inventoryDetails.AcknowledgementInfo.Status = args[1]
	inventoryDetails.AcknowledgementInfo.DoneBy = args[2]
	inventoryDetails.AcknowledgementInfo.Remark = args[3]

	err = marshalAndPutState(stub, args[0], inventoryDetails)
	if err != nil {
		return shim.Error(fmt.Sprintf("marshalAndPutStateError: %s", err))
	}

	fmt.Printf("Updated Escalation Status\n\n")

	return shim.Success(nil)
}

func getStateAndUnmarshal(stub shim.ChaincodeStubInterface, id string, t interface{}) error {

	idAsBytes, err := stub.GetState(id)
	if err != nil {
		return fmt.Errorf("GetWorldStateError: %s", err)
	}

	//Unmarshal
	return (json.Unmarshal(idAsBytes, &t))
}
func marshalAndPutState(stub shim.ChaincodeStubInterface, id string, data interface{}) error {

	//Marshal
	dataAsBytes, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("MarshallingError: %s", err)
	}
	//Add to the ledger world state
	return (stub.PutState(id, dataAsBytes))
}

func (t *SmartContract) queryData(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	//   0
	// "queryString"
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	queryString := args[0]

	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(queryResults)
}

func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {

	fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)

	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	buffer, err := constructQueryResponseFromIterator(resultsIterator)
	if err != nil {
		return nil, err
	}

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil
}

func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) (*bytes.Buffer, error) {
	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return &buffer, nil
}

func (s *SmartContract) getAllInventory(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	fmt.Printf("Get All Inventory from ledger ...\n")
	resultsIterator, err := stub.GetStateByRange("inventory-0", "inventory-999999999999999999999")
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryRecords
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		//queryKeyAsStr, queryValAsBytes, err := resultsIterator.Next()
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("get_all_components:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func main() {
	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
