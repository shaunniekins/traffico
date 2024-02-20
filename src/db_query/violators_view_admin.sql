CREATE VIEW "ViewTricycleDriverViolationsAdmin" AS
SELECT
    RV.id,
    RV.complain,
    RV.date,
    RV.time,
    Rv.violation,
    RV.action_taken,
    APP.body_num,
    APP.franchise_status,
    CONCAT(DP.first_name, ' ', DP.last_name) AS driver_name,
    DP.license_num AS driver_license_num,
    CONCAT(OP.first_name, ' ', OP.last_name) AS operator_name,
    OP.address AS operator_address,
    VOR.lto_plate_num AS vehicle_plate_num,
    VOR.date_registered AS vehicle_date_registered,
    VOR.zone AS vehicle_zone
FROM
    "ReportViolations" AS RV
    JOIN "Applications" AS APP ON RV.body_num = APP.body_num
    JOIN "DriverProfiles" AS DP ON APP.driver_id = DP.id
    JOIN "OperatorProfiles" AS OP ON APP.operator_id = OP.id
    JOIN (
        SELECT
            operator_id,
            lto_plate_num,
            date_registered,
            zone
        FROM
            (
                SELECT
                    operator_id,
                    lto_plate_num,
                    date_registered,
                    zone,
                    ROW_NUMBER() OVER (
                        PARTITION BY operator_id
                        ORDER BY
                            date_registered DESC
                    ) as rn
                FROM
                    "VehicleOwnershipRecords"
            ) t
        WHERE
            rn = 1
    ) AS VOR ON OP.id = VOR.operator_id;