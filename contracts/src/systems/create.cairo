#[system]
mod create_game {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use dojo::world::Context;
    use option::OptionTrait;

    use RealmsRisingRevenant::components::Game;
    use RealmsRisingRevenant::components::GameTracker;

    use RealmsRisingRevenant::components::GameEntityCounter;

    use RealmsRisingRevenant::constants::GAME_CONFIG;


    // Creates a new game
    // increments game id
    // sets game tracker
    // TODO: Add Lords Deposit
    fn execute(ctx: Context) -> u32 {
        let mut game_tracker = get!(ctx.world, (GAME_CONFIG), GameTracker);
        let game_id = game_tracker.count + 1; // game id increment

        let start_time = 0; // blocknumber
        let prize = 0; // total prize
        let status = true; // game status

        set!(ctx.world, (Game { game_id, start_time, prize, status }));

        set!(ctx.world, (GameEntityCounter { game_id, outpost_count: 0, event_count: 0 }));

        set!(
            ctx.world, (GameTracker { entity_id: GAME_CONFIG.try_into().unwrap(), count: game_id })
        );

        // Emit World Event
        return (game_id);
    }
}
