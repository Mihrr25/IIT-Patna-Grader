import openpyxl as op
from flask import Flask, request,send_file,jsonify
from io import BytesIO
from flask_cors import CORS
from grader import grader

app = Flask(__name__)
CORS(app)
@app.route("/upload", methods=["POST"])
def upload_file():
    file = request.files["file"]
    print("hefllo")
    print(file)

    if not (file.filename.endswith(".xls") or file.filename.endswith(".xlsx")):
        return {"error": "Invalid file type"}, 404
    # print("hefllo")

    workbook = op.load_workbook(file)
    workbook2=grader(workbook)

    if workbook2 is None:
        return jsonify({"error": "Total weightage is not 100"}), 404
    output = BytesIO()
    workbook2.save(output)
    output.seek(0)
    # print("HELLO",output)
    return send_file(output, download_name="graded_workbook.xlsx", as_attachment=True, mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

if __name__ == "__main__":
    app.run()
