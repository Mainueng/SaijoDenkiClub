import React, { useState, useEffect } from "react";
import { DataTable } from "react-native-paper";

const TimeSheetSheetScreen = () => {
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title numeric>หมายเลขงาน</DataTable.Title>
        <DataTable.Title>ลูกค้า</DataTable.Title>
        <DataTable.Title>วัน-เวลานัดหมาย</DataTable.Title>
        <DataTable.Title>วัน-เวลาเช็คอิน</DataTable.Title>
        <DataTable.Title>วัน-เวลาเช็คเอาท์</DataTable.Title>
        <DataTable.Title>หมายเหตุ</DataTable.Title>
      </DataTable.Header>
    </DataTable>
  );
};

export default TimeSheetSheetScreen;
