use std::{error, vec};
use std::sync::Mutex;
use launchy::{InputDevice, OutputDevice};
use tauri::{State};
use launchy::{launchpad_mini::{Button, Color, Input, Output, DoubleBufferingBehavior}};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![set_control_button_color])
        .invoke_handler(tauri::generate_handler![launchpad_connected])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

struct LaunchpadState{
    output: Mutex<Option<Output>>,
    input: Mutex<Option<Input>>,
}

impl LaunchpadState {
    pub fn new() -> Self {
        Self {
            output: Mutex::new(None),
            input: Mutex::new(None),
        }
    }
}

#[tauri::command]
fn connect_launchpad(state: State<'_, LaunchpadState>) -> Result<(), String> {
    let mut output_guard = state.output.lock().map_err(|e| e.to_string())?;
    let mut input_guard = state.input.lock().map_err(|e| e.to_string())?;

    if output_guard.is_some() {
        return Ok(());
    }

    let output = Output::guess().map_err(|e| e.to_string())?;
    let input = Input::guess_polling().map_err(|e| e.to_string())?;

    *output_guard = Some(output);
    *input_guard = Some(input);
    
    Ok(())
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