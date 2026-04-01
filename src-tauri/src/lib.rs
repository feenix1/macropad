use std::{error, vec};

use launchy::{MidiError, OutputDevice, launchpad_mini::{Button, Color, Input, Output, DoubleBufferingBehavior}};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![set_control_button_color])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn string_to_color(color_str: &str) -> Result<Color, &str> {
    match color_str {
        "off" => Ok(Color::OFF),
        "red" => Ok(Color::RED),
        "green" => Ok(Color::GREEN),
        "amber" => Ok(Color::AMBER),
        "dim_green" => Ok(Color::DIM_GREEN),
        "dim_red" => Ok(Color::DIM_RED),
        "orange" => Ok(Color::ORANGE),
        "yellow" => Ok(Color::YELLOW),
        _ => Err("Invalid color string!")
    } 
}

#[tauri::command]
fn set_control_button_color(index: u8, color: String) -> Result<(), String> {
    let mut output = Output::guess()
        .map_err(|_| "MidiError")?;
    let button = Button::ControlButton { index };
    let color = string_to_color(color.as_str())?;
    return Ok(output.set_button(button, color, DoubleBufferingBehavior::None)
        .map_err(|_| "MidiError")?);
}

// fn set_grid_button_color(x: u8, y: u8, color: String) 