package hospital.management.system;

import net.proteanit.sql.DbUtils;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.ResultSet;

public class SearchRoom extends JFrame {

    Choice choice;
    JTable table;

    SearchRoom(){


        JPanel panel = new JPanel();
        panel.setBounds(5,5,690,490);
        panel.setBackground(new Color(90,156,163));
        panel.setLayout(null);
        add(panel);

        JLabel For = new JLabel("Search For Room");
        For.setBounds(250,11,186,31);
        For.setForeground(Color.WHITE);
        For.setFont(new Font("Tahoma", Font.BOLD,20));
        panel.add(For);

        JLabel status = new JLabel("Status :");
        status.setBounds(70,70,80,20);
        status.setForeground(Color.WHITE);
        status.setFont(new Font("Tahoma", Font.BOLD,14));
        panel.add(status);

        choice = new Choice();
        choice.setBounds(170,70,120,20);
        choice.add("Available");
        choice.add("Occupied");
        panel.add(choice);

        table = new JTable();
        table.setBounds(0,187,700,210);
        table.setBackground(new Color(90,156,163));
        table.setForeground(Color.WHITE);
        panel.add(table);

        try{

            Conn c = new Conn();
            String q = "select * from room";
            ResultSet resultSet = c.statement.executeQuery(q);
            table.setModel(DbUtils.resultSetToTableModel(resultSet));

        } catch (Exception e) {
            e.printStackTrace();
        }

        JLabel Roomno = new JLabel("Room Number");
        Roomno.setBounds(0,162,150,20);
        Roomno.setForeground(Color.WHITE);
        Roomno.setFont(new Font("Tahoma", Font.BOLD,14));
        panel.add(Roomno);

        JLabel available = new JLabel("Availability");
        available.setBounds(175,162,150,20);
        available.setForeground(Color.WHITE);
        available.setFont(new Font("Tahoma", Font.BOLD,14));
        panel.add(available);

        JLabel price = new JLabel("Price");
        price.setBounds(350,162,150,20);
        price.setForeground(Color.WHITE);
        price.setFont(new Font("Tahoma", Font.BOLD,14));
        panel.add(price);

        JLabel Bed = new JLabel("Bed Type");
        Bed.setBounds(523,162,150,20);
        Bed.setForeground(Color.WHITE);
        Bed.setFont(new Font("Tahoma", Font.BOLD,14));
        panel.add(Bed);

        JButton search = new JButton("Search");
        search.setBounds(200,420,120,25);
        search.setBackground(Color.black);
        search.setForeground(Color.WHITE);
        panel.add(search);
        search.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

                String q = "select * from room where Availability = '"+choice.getSelectedItem()+"'";

                try{

                    Conn c = new Conn();
                    ResultSet resultSet = c.statement.executeQuery(q);
                    table.setModel(DbUtils.resultSetToTableModel(resultSet));
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        });

        JButton Back = new JButton("Back");
        Back.setBounds(380,420,120,25);
        Back.setBackground(Color.black);
        Back.setForeground(Color.WHITE);
        panel.add(Back);
        Back.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                setVisible(false);
            }
        });

        setUndecorated(true);
        setSize(700,500);
        setLayout(null);
        setLocation(450,250);
        setVisible(true);
    }

    public static void main(String[] args) {
        new SearchRoom();
    }
}
