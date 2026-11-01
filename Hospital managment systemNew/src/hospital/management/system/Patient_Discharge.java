package hospital.management.system;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.ResultSet;
import java.util.Date;

public class Patient_Discharge extends JFrame {

    Patient_Discharge(){

        JPanel panel = new JPanel();
        panel.setBounds(5,5,790,390);
        panel.setBackground(new Color(90,156,163));
        panel.setLayout(null);
        add(panel);

        JLabel label = new JLabel("CHECK-OUT");
        label.setBounds(100,20,150,20);
        label.setFont(new Font("Tahoma",Font.BOLD,20));
        label.setForeground(Color.WHITE);
        panel.add(label);

        JLabel label1 = new JLabel("Customer Id");
        label1.setBounds(30,80,150,20);
        label1.setFont(new Font("Tahoma",Font.BOLD,14));
        label1.setForeground(Color.WHITE);
        panel.add(label1);

        Choice choice = new Choice();
        choice.setBounds(200,80,150,25);
        panel.add(choice);

        try{

            Conn c = new Conn();
            ResultSet resultSet = c.statement.executeQuery("select * from patient_info");

            while(resultSet.next()){
                choice.add(resultSet.getString("number"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        JLabel label2 = new JLabel("Room Number");
        label2.setBounds(30,130,150,20);
        label2.setFont(new Font("Tahoma",Font.BOLD,14));
        label2.setForeground(Color.WHITE);
        panel.add(label2);

        JLabel RN = new JLabel();
        RN.setBounds(200,130,150,20);
        RN.setFont(new Font("Tahoma",Font.BOLD,14));
        RN.setForeground(Color.WHITE);
        panel.add(RN);

        JLabel label3 = new JLabel("Check-In-Time");
        label3.setBounds(30,180,150,20);
        label3.setFont(new Font("Tahoma",Font.BOLD,14));
        label3.setForeground(Color.WHITE);
        panel.add(label3);

        JLabel INTime = new JLabel();
        INTime.setBounds(200,180,250,20);
        INTime.setFont(new Font("Tahoma",Font.BOLD,14));
        INTime.setForeground(Color.WHITE);
        panel.add(INTime);

        JLabel label4 = new JLabel("Check-Out-Time");
        label4.setBounds(30,230,150,20);
        label4.setFont(new Font("Tahoma",Font.BOLD,14));
        label4.setForeground(Color.WHITE);
        panel.add(label4);

        Date date = new Date();

        JLabel OUTTime = new JLabel(""+date);
        OUTTime.setBounds(200,230,250,20);
        OUTTime.setFont(new Font("Tahoma",Font.BOLD,14));
        OUTTime.setForeground(Color.WHITE);
        panel.add(OUTTime);

        JButton discharge = new JButton("Discharge");
        discharge.setBounds(30,300,120,30);
        discharge.setBackground(Color.BLACK);
        discharge.setForeground(Color.WHITE);
        panel.add(discharge);
        discharge.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Conn c = new Conn();
                try {
                    String roomNo = "";
                    ResultSet rs = c.statement.executeQuery(
                            "select Room_Number from patient_info where number = '" + choice.getSelectedItem() + "'"
                    );
                    if (rs.next()) {
                        roomNo = rs.getString("Room_Number");
                    }

                    c.statement.executeUpdate("delete from patient_info where number = '" + choice.getSelectedItem() + "'");

                    if (!roomNo.isEmpty()) {
                        c.statement.executeUpdate("update room set Availability = 'Available' where room_no = '" + roomNo + "'");
                    }

                    JOptionPane.showMessageDialog(null, "Done");
                    setVisible(false);
                } catch (Exception E) {
                    E.printStackTrace();
                }
            }
        });

        JButton Check = new JButton("Check");
        Check.setBounds(170,300,120,30);
        Check.setBackground(Color.BLACK);
        Check.setForeground(Color.WHITE);
        panel.add(Check);
        Check.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Conn c = new Conn();
                try{

                    ResultSet resultSet = c.statement.executeQuery("select * from patient_info where number= '"+choice.getSelectedItem()+"'");
                    while (resultSet.next()){

                        RN.setText(resultSet.getString("Room_Number"));
                        INTime.setText(resultSet.getString("Time"));
                    }

                } catch (Exception E){
                    E.printStackTrace();
                }
            }
        });

        JButton Back = new JButton("Back");
        Back.setBounds(300,300,120,30);
        Back.setBackground(Color.BLACK);
        Back.setForeground(Color.WHITE);
        panel.add(Back);
        Back.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                setVisible(false);
            }
        });


        setUndecorated(true);
        setSize(800,400);
        setLayout(null);
        setLocation(400,250);
        setVisible(true);
    }

    public static void main(String[] args) {
        new Patient_Discharge();
    }
}
