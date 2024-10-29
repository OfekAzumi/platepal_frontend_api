import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Get_Employees, Add_Employee, Update_Employee, Delete_Employee } from './employeeAPI';

export interface employeeState {
  id?: number;
  unicode: string;
  name: string;
  notes: string;
  permission: {
    shiftManager: boolean;
  };
  hours: []
  employees: [{
    id: number;
    unicode: string;
    name: string;
    notes: string;
    permission: {
      shiftManager: boolean;
    };
    hours: hours[];
  }];
}

export interface hours {
  year: number;
  month: number;
  day: number;
  enter: {
    hour: number;
    minutes: number;
  };
  exit: {
    hour: number;
    minutes: number;
  };
  total: {
    hour: number;
    minutes: number;
  }
}

const initialState: employeeState = {
  id: undefined,
  unicode: '',
  name: '',
  notes: '',
  permission: { shiftManager: false },
  hours: [],
  employees: [{
    id: -1, // (-1) represents zero data in employees
    unicode: '',
    name: '',
    notes: '',
    permission: { shiftManager: false },
    hours: [],
  }]

};

export const getEmployeesAsync = createAsyncThunk(
  'employee/GetAll',
  async () => {
    const response = await Get_Employees();
    return response.data;
  }
);

export const addEmployeeAsync = createAsyncThunk(
  'employee/Add',
  async (data: {
    unicode: string;
    name: string;
    notes: string;
    permission: {
      shiftManager: boolean;
    };
    hours: hours[];
  }) => {
    const response = await Add_Employee(data);
    return response.data;
  }
);

export const updateEmployeeAsync = createAsyncThunk(
  'employee/Update',
  async (data: {
    id: number,
    unicode: string;
    name: string;
    notes: string;
    permission: {
      shiftManager: boolean;
    };
    hours: hours[];
  }) => {
    const response = await Update_Employee(data);
    console.log(response);
    return response.data;
  }
);

export const deleteEmployeeAsync = createAsyncThunk(
  'employee/Delete',
  async (employeeId: number) => {
    const response = await Delete_Employee(employeeId);
    return response.data;
  }
);

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeesAsync.fulfilled, (state, action) => {
        state.employees = action.payload
      })
      .addCase(getEmployeesAsync.rejected, (state, action) => {
      })
      .addCase(addEmployeeAsync.fulfilled, (state, action) => {
      })
      .addCase(addEmployeeAsync.rejected, (state, action) => {
      })
      .addCase(updateEmployeeAsync.fulfilled, (state, action) => {
      })
      .addCase(updateEmployeeAsync.rejected, (state, action) => {
      })
      .addCase(deleteEmployeeAsync.fulfilled, (state, action) => {
      })
      .addCase(deleteEmployeeAsync.rejected, (state, action) => {
      });
  },
});



export const selectEmployees = (state: RootState) => state.employee.employees;

export default employeeSlice.reducer;
