var jpdbUrl = "http://api.login2explore.com:5577";
var jpdbIrl = "/api/irl";
var jpdbIml = "/api/iml";
var relation = "Student-Rel";
var token = "90933196|-31949319875742489|90951122";

function resetForm() {
  $("#rollno").val("");
  $("#fullName").val("");
  $("#birthDate").val("");
  $("#class").val("");
  $("#address").val("");
  $("#enrollmentDate").val("");
  $("#save").prop(true);
  $("#change").prop(true);
  $("#reset").prop(true);
  $("#rollno").val("").focus();
}

function saveData(){
  var jsonStrObj = validateData();
  if (jsonStrObj === "") {
    return "";
  }

  var putRequest = createPUTRequest(
    token,
    jsonStrObj,
    "student",
    relation
  );
  ////alert(JSON.stringify(putRequest));
  jQuery.ajaxSetup({ async: false });

  var resJsonObj = executeCommandAtGivenBaseUrl(
    putRequest,
    jpdbUrl,
    jpdbIml
  );

  jQuery.ajaxSetup({ async: true });
  ////alert(JSON.stringify(resJsonObj));
  resetForm();
  $("#rollno").focus();

}

function updateData() {
$("#change").prop("disabled", true);
  jsonChg = validateData();
  var updateRequest = createUPDATERecordRequest(
    token,
    jsonChg,
    "student",
    relation,
    localStorage.getItem("recno")
  );
  console.log(jsonChg);
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    updateRequest,
    jpdbUrl,
    jpdbIml
  );
  alert("success")

    jQuery.ajaxSetup({ async: true });
    resetForm();
    $("#studForm").focus();
}

$('#resetForm').on('click',resetForm());
$('#saveData').on('click',saveData());
$('#changeData').on('click',updateData());


$("#studform").focus();

function saveRecNo2LS(data) {
  console.log(data)

  var lvData = JSON.parse(data);
  localStorage.setItem("recno", lvData.rec_no);
}

function getStuRollNoAsJsonObj() {
  var sturollno = $("#rollno").val();
  var jsonStr = { rollno: sturollno };

  return JSON.stringify(jsonStr);
}

function fillData(data) {
  saveRecNo2LS(data);
  var recd = JSON.parse(data).record;
  $("#fullName").val(recd.name);
  $("#class").val(recd.class);
  $("#birthDate").val(recd.Dateofbirth);
  $("#address").val(recd.stuaddress);
  $("#enrollmentDate").val(recd.enroll);
}

function validateData() {
  var sturollno, stuname, stuclass, studob, stuaddress, stuenrolldate;
  sturollno = $("#rollno").val();
  stuname = $("#fullName").val();
  stuclass = $("#class").val();
  studob = $("#birthDate").val();
  stuaddress = $("#address").val();
  stuenrolldate = $("#enrollmentDate").val();

  if (sturollno === "") {
    //alert("Student ID missing");
    $("#rollno").focus();
    return "";
  }
  if (stuname === "") {
    //alert("Student Name missing");
    $("#fullName").focus();
    return "";
  }
  if (stuclass === "") {
    //alert("Student Class missing");
    $("#class").focus();
    return "";
  }
  if (studob === "") {
    //alert("Student Birth Date is missing");
    $("#birthdate").focus();
    return "";
  }
  if (stuaddress === "") {
    alert("","Student Address missing");
    $("#address").focus();
    return "";
  }
  if (stuenrolldate === "") {
    alert("Student Enrollment Date missing");
    $("#enrollmentDate").focus();
    return "";
  }

  var jsonStrObj = {
    rollno: sturollno,
    name: stuname,
    class: stuclass,
    Dateofbirth: studob,
    stuaddress: stuaddress,
    enroll: stuenrolldate,
  };

  return JSON.stringify(jsonStrObj);
}



function getStu() {
  var sturollnoJsonObj = getStuRollNoAsJsonObj();

  var getRequest = createGET_BY_KEYRequest(token, 'student', relation, sturollnoJsonObj);
  jQuery.ajaxSetup({ async: false });
  console.log(getRequest)
  var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbUrl, jpdbIrl);
  (JSON.stringify(resJsonObj));
  jQuery.ajaxSetup({ async: true });

  if (resJsonObj.status === 400) {
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#stuname").focus();
  } else if (resJsonObj.status == 200) {
    $("#rollNo").prop("disabled", true);
    fillData(resJsonObj.data);

    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
  }
  $("#stuname").focus();
}


