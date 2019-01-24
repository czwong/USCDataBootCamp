Attribute VB_Name = "Module1"
Sub RunAll()
    Dim ws As Worksheet
    Application.ScreenUpdating = False
    
    For Each ws In Worksheets
        ws.Select
        Call ClearCellsOnlyData
        Call Calculate
        Call GreatestChange
        
    Next
    Application.ScreenUpdating = True
    
End Sub

'Clear cell but not formats
Sub ClearCellsOnlyData()
    Range("I:P").Clear
End Sub

'Find tickers, total volume, yearly change and percentage change
Sub Calculate()

'***Finding Tickers***
    Cells(1, "I") = "Tickers"
    
    'Finding length of column A
    Dim col As Long
    col = Cells(Rows.Count, "A").End(xlUp).Row
    
    'Use as a counter to move to next row after reading new ticker symbol
    Ticker = 0
    
    'Loops through each ticker cell to determine if a new ticker symbol appears then indent counter
    For i = 2 To col
        If Cells(i - 1, 1) <> Cells(i, 1) Then
            Ticker = Ticker + 1
            Cells(Ticker + 1, "I") = Cells(i, 1)
        
        End If
        
    Next i
    
'***Finding total volume for each ticker***
    Cells(1, "J") = "Volume"
    
    'Start count at 2 to set row at 2 in Sum Volume column
    vol = 2
    
    'Loops through all volume cells associated with ticker to add volume
    For i = 1 To col
        If Cells(vol, "I") = Cells(i + 1, "A") Then
            Cells(vol, "J") = Cells(vol, "J") + Cells(i + 1, "G")
        Else
            vol = vol + 1
            
        End If
    
    Next i
    
'***Find yearly change***
    Cells(1, "K") = "Yearly Change"
        
    Row = 1
    For i = 2 To col + 1
        'Checks for new ticker as it loops through first column
        If Cells(i - 1, 1) <> Cells(i, 1) Then
            'If new ticker is found then store opening year value into next yearly change cell
            Cells(Row + 1, "K") = Cells(i, "C")
            
            'First row does not contain numeric value thus cannot be stored
            If IsNumeric(Cells(Row, "K")) Then
                'Subtracts closing year value of current ticker by its opening year value
                Cells(Row, "K") = Cells(i - 1, "F") - Cells(Row, "K")
                
                'Positive change highlihted in green and negative change highlighted in red
                If Cells(Row, "K") > 0 Then
                    Cells(Row, "K").Interior.ColorIndex = 4
                Else
                    Cells(Row, "K").Interior.ColorIndex = 3
                
                End If
                
            End If
            
        Row = Row + 1
        
        End If
        
    Next i
    
'***Find percentage change***
    Cells(1, "L") = "Percent Change"
    
    Row = 1
    For i = 2 To col
        If Cells(i - 1, 1) <> Cells(i, 1) Then
            'Checks to see that no value divides 0
            If Cells(i, "C") <> 0 Then
                Cells(Row + 1, "L") = Format(Cells(Row + 1, "K") / Cells(i, "C"), "Percent")
            Else
                Cells(Row + 1, "L") = Format(0, "Percent")
                
            End If
        Row = Row + 1
        
        End If
    
    Next i
End Sub

Sub GreatestChange()

    'Label Cells
    Cells(2, "N") = "Greatest % Increase"
    Cells(3, "N") = "Greatest % Decrease"
    Cells(4, "N") = "Greatest Total Volume"
    Cells(1, "O") = "Ticker"
    Cells(1, "P") = "Value"
    
    'Find legnth of column "I" since length for column I to L are same
    Dim lgnth As Long
    lgnth = Cells(Rows.Count, "I").End(xlUp).Row
    
    'Start at greatest % increase column/row
    Row = 2
    
    'Start Ticker and Greatest Percent Increase equal to start of ticker and percent change column
    Cells(Row, "P") = Cells(2, "L")
    Cells(Row, "O") = Cells(2, "I")
    
    'Starting at row 2 loop through column L using column length
    For i = 2 To lgnth
    
        'Checks to see if starting Greatest % Increase is less than percentage cells, if so then replace Greatest % Increase cell
        'If Greatest % Increase cell is greater then remain the same
        If Cells(Row, "P") < Cells(i, "L") Then
            Cells(Row, "P") = Format(Cells(i, "L"), "percent")
            Cells(Row, "O") = Cells(i, "I")
            
        End If
        
    Next i
    
    'Increment after filling in greatest % increase to move onto greatest % decrease column/row
    Row = Row + 1
    
    'Starting at row 2 loop through column L using column length
    For i = 2 To lgnth
    
        'Checks to see if starting Greatest % Decrease is greater than percentage cells, if so then replace Greatest % Decrease cell
        'If Greatest % Decrease cell is lower then remain the same
        If Cells(Row, "P") > Cells(i, "L") Then
            Cells(Row, "P") = Format(Cells(i, "L"), "percent")
            Cells(Row, "O") = Cells(i, "I")
        
        End If
        
    Next i
    
    'Start Ticker and Greatest Total Volume equal to start of ticker and volume change column/row
    Cells(4, "P") = Cells(2, "J")
    Cells(4, "O") = Cells(2, "I")
    
    'Starting at row 2 loop through column J using column length
    For i = 2 To lgnth
    
        'Checks to see if starting Greatest Total Volume is less than volume cells, if so then replace Greatest Total Volume cell
        'If Greatest Total Volume cell is greater then remain the same
        If Cells(4, "P") < Cells(i, "J") Then
            Cells(4, "P") = Cells(i, "J")
            Cells(4, "O") = Cells(i, "I")
        
        End If
        
    Next i
    
End Sub
