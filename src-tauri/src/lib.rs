use std::{vec};
use std::sync::{Arc, Mutex};
use launchy::mini::Message;
use launchy::{InputDevice, InputDeviceHandler, OutputDevice};
use serde::Serialize;
use tauri::{AppHandle, Emitter, State};
use launchy::{launchpad_mini::{Button, Color, Input, Output}};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(LaunchpadState::new())
        .invoke_handler(tauri::generate_handler![connect_launchpad, disconnect_launchpad, is_connected, light_grid_pad, light_control_pad])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

struct LaunchpadState{
    output: Arc<Mutex<Option<Output>>>,
    input: Arc<Mutex<Option<InputDeviceHandler>>>,
}

impl LaunchpadState {
    pub fn new() -> Self {
        Self {
            output: Arc::new(Mutex::new(None)),
            input: Arc::new(Mutex::new(None)),
        }
    }
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct ControlButtonPos {
    index: u8,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct GridButtonPos {
    x: u8,
    y: u8,
}

#[tauri::command]
fn connect_launchpad(app_handle: AppHandle, state: State<'_, LaunchpadState>) -> Result<(), String> {
    let mut output_guard = state.output.lock().map_err(|e| e.to_string())?;
    let mut input_guard = state.input.lock().map_err(|e| e.to_string())?;

    let mut output = Output::guess().map_err(|e| e.to_string())?;
    // Use output clone for rust input handling later
    // let output_clone = Arc::clone(&state.output);
    let input = Input::guess(move |message| {
        match message {
            Message::Press { button } => {
                println!("Button pressed: {:?}", button);
                if button.is_top_control_button() {
                    let _ = app_handle.emit("control-button-pressed", ControlButtonPos {
                        index: button.abs_x(),
                    });
                }
                else if button.is_main_grid_button() {
                    let _ = app_handle.emit("button-pressed", GridButtonPos {
                        x: button.abs_x(),
                        // Adjust y to have origin at top-left of main grid instead of control buttons
                        y: button.abs_y() - 1,
                    });
                }
                else if button.is_scene_launch_button() {
                    let _ = app_handle.emit("button-pressed", GridButtonPos {
                        x: button.abs_x(),
                        y: button.abs_y() - 1,
                    });
                }
            },
            Message::Release { button } => {
                println!("Button released: {:?}", button);
                if button.is_top_control_button() {
                    let _ = app_handle.emit("control-button-released", ControlButtonPos {
                        index: button.abs_x(),
                    });
                }
                else if button.is_main_grid_button() {
                    let _ = app_handle.emit("button-released", GridButtonPos {
                        x: button.abs_x(),
                        y: button.abs_y() - 1,
                    });
                }
                else if button.is_scene_launch_button() {
                    let _ = app_handle.emit("button-released", GridButtonPos {
                        x: button.abs_x(),
                        y: button.abs_y() - 1,
                    });
                }
            },
            _ => {}
        }
    }).map_err(|e| e.to_string())?;

    if !output.request_device_inquiry(launchy::s::DeviceIdQuery::Any).is_ok() {
        *output_guard = None;
        *input_guard = None;
        return Err("Failed to connect to launchpad".to_string());
    }

    *output_guard = Some(output);
    *input_guard = Some(input);

    Ok(())
}

#[tauri::command]
fn disconnect_launchpad(state: State<'_, LaunchpadState>) -> Result<(), String> {
    let mut output_guard = state.output.lock().map_err(|e| e.to_string())?;
    let mut input_guard = state.input.lock().map_err(|e| e.to_string())?;

    *output_guard = None;
    *input_guard = None;

    Ok(())
}

#[tauri::command]
fn is_connected(state: State<'_, LaunchpadState>) -> bool {
    let mut output_guard = match state.output.lock() {
        Ok(guard) => guard,
        Err(_) => {
            println!("Failed to acquire lock on output device state");
            return false
        }, // If we can't acquire the lock, assume not connected
    };
    let output = output_guard.as_mut();
    if let Some(output) = output {
        output.request_device_inquiry(launchy::s::DeviceIdQuery::Any).is_ok()
    } else {
        println!("No output device found in state");
        false
    }
}

#[tauri::command]
fn light_grid_pad(x: u8, y: u8, color: &str, state: State<'_, LaunchpadState>) -> Result<(), String> {
    let color = string_to_color(&color).map_err(|e| e.to_string())?;
    let mut output_guard = state.output.lock().map_err(|e| e.to_string())?;
    if let Some(output) = output_guard.as_mut() {
        output.light(Button::GridButton { x, y }, color).map_err(|e| e.to_string())?;
    } else {
        return Err("Not connected to launchpad".to_string());
    }
  Ok(())
}

#[tauri::command]
fn light_control_pad(index: u8, color: &str, state: State<'_, LaunchpadState>) -> Result<(), String> {
    let color = string_to_color(&color).map_err(|e| e.to_string())?;
    let mut output_guard = state.output.lock().map_err(|e| e.to_string())?;
    if let Some(output) = output_guard.as_mut() {
        output.light(Button::ControlButton { index }, color).map_err(|e| e.to_string())?;
    } else {
        return Err("Not connected to launchpad".to_string());
    }
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