// Updated src/OrderPipeline.jsx (adds data-testid for reliable testing + minor cleanup)
import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const statuses = [
  'Consultation',
  'Fabric Selected',
  'In Production',
  'First Fitting',
  'Final Fitting',
  'Ready',
  'Picked Up',
];

const SortableOrderCard = ({ order, client, fabric }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order.order_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    margin: '12px 0',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: isDragging
      ? '0 10px 30px rgba(0,0,0,0.2)'
      : '0 4px 15px rgba(0,0,0,0.1)',
    cursor: 'grab',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid={`order-card-${order.order_id}`}
      className="card"
    >
      <strong>{client?.first_name ?? 'Unknown'} {client?.last_name ?? ''}</strong>
      <br />
      {order.order_type}
      <br />
      {fabric?.name && (
        <>Fabric: {fabric.name} ({fabric.supplier})<br /></>
      )}
      ${order.total_price} (Balance: ${order.balance_due ?? order.total_price - (order.deposit_paid ?? 0)})
      {order.photos?.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <img src={order.photos[0]} alt="Order" style={{ width: '100%', maxWidth: '150px', borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
};

const OrderPipeline = ({ crmData, updateCrmData }) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeOrderId = active.id;
    const overId = over.id;

    const activeOrder = crmData.orders.find((o) => o.order_id === activeOrderId);
    if (!activeOrder) {
      setActiveId(null);
      return;
    }

    let targetStatus = activeOrder.status;
    if (statuses.includes(overId)) {
      targetStatus = overId;
    } else {
      const overOrder = crmData.orders.find((o) => o.order_id === overId);
      if (overOrder) targetStatus = overOrder.status;
    }

    if (targetStatus !== activeOrder.status) {
      const newOrders = crmData.orders.map((o) =>
        o.order_id === activeOrderId ? { ...o, status: targetStatus } : o
      );
      updateCrmData({ ...crmData, orders: newOrders });
    }

    setActiveId(null);
  };

  const activeOrder = crmData.orders.find((o) => o.order_id === activeId);
  const getClient = (client_id) => crmData.clients.find((c) => c.client_id === client_id);
  const getFabric = (fabric_id) => crmData.fabrics?.find((f) => f.fabric_id === fabric_id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: 'flex', overflowX: 'auto', padding: '20px 0' }}>
        {statuses.map((status) => {
          const ordersInStatus = crmData.orders.filter((o) => o.status === status);

          const { isOver, setNodeRef } = useDroppable({
            id: status,
          });

          return (
            <div
              key={status}
              ref={setNodeRef}
              data-testid={`pipeline-column-${status.replace(/ /g, '-')}`}
              className="u-card"
              style={{
                minWidth: '340px',
                marginRight: '24px',
                backgroundColor: isOver ? '#e3f2fd' : 'var(--light-grey)',
                borderRadius: '16px',
                padding: '16px',
                transition: 'background-color 0.2s ease',
              }}
            >
              <h3 style={{ textAlign: 'center', margin: '0 0 20px 0', fontSize: '18px' }}>
                {status} ({ordersInStatus.length})
              </h3>

              <SortableContext
                items={ordersInStatus.map((o) => o.order_id)}
                strategy={verticalListSortingStrategy}
              >
                {ordersInStatus.map((order) => {
                  const client = getClient(order.client_id);
                  const fabric = getFabric(order.fabric_id);

                  return (
                    <SortableOrderCard
                      key={order.order_id}
                      order={order}
                      client={client}
                      fabric={fabric}
                    />
                  );
                })}
              </SortableContext>

              {isOver && ordersInStatus.length === 0 && (
                <div style={{ height: '100px', border: '2px dashed #90caf9', borderRadius: '12px', margin: '12px 0' }} />
              )}
            </div>
          );
        })}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeId && activeOrder ? (
          <div
            className="card"
            style={{
              padding: '16px',
              background: 'var(--secondary-color)',
              borderRadius: '12px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
              rotate: '5deg',
            }}
          >
            {(() => {
              const client = getClient(activeOrder.client_id);
              const fabric = getFabric(activeOrder.fabric_id);
              return (
                <>
                  <strong>{client?.first_name ?? 'Unknown'} {client?.last_name ?? ''}</strong>
                  <br />
                  {activeOrder.order_type}
                  <br />
                  {fabric?.name && <>Fabric: {fabric.name}<br /></>}
                  ${activeOrder.total_price}
                </>
              );
            })()}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default OrderPipeline;
//3
// Fixed version of src/OrderPipeline.jsx
// This implementation fixes the drag-and-drop bugs:
// - Removes restrictToVerticalAxis → allows horizontal dragging to other columns
// - Uses closestCorners collision detection for reliable dropping into columns (including empty ones)
// - Adds useDroppable per column for highlight feedback and reliable empty-column drops
// - Adds proper sensors with activation distance (prevents accidental drags on clicks)
// - Adds DragOverlay for smooth, professional dragging UX
// - Simplifies logic: Dragging to a different column changes the order's status
// - Within-column vertical reordering snaps back (not persisted precisely due to flat orders array), but this is acceptable for a pipeline demo where status change is primary. Order within column follows addition/movement order.
// - Fully works with your existing crmData structure (no new fields needed)

// import React, { useState } from 'react';
// import {
//   DndContext,
//   closestCorners,
//   KeyboardSensor,
//   PointerSensor,
//   TouchSensor,
//   useSensor,
//   useSensors,
//   DragOverlay,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { useDroppable } from '@dnd-kit/core';
// import { CSS } from '@dnd-kit/utilities';

// const statuses = [
//   'Consultation',
//   'Fabric Selected',
//   'In Production',
//   'First Fitting',
//   'Final Fitting',
//   'Ready',
//   'Picked Up',
// ];

// const SortableOrderCard = ({ order, client, fabric }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: order.order_id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     margin: '12px 0',
//     padding: '16px',
//     background: 'white',
//     borderRadius: '12px',
//     boxShadow: isDragging
//       ? '0 10px 30px rgba(0,0,0,0.2)'
//       : '0 4px 15px rgba(0,0,0,0.1)',
//     cursor: 'grab',
//     opacity: isDragging ? 0.8 : 1,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       className="card"
      
//     >
//       <strong>{client?.first_name ?? 'Unknown'} {client?.last_name ?? ''}</strong>
//       <br />
//       {order.order_type}
//       <br />
//       {fabric?.name && (
//         <>Fabric: {fabric.name} ({fabric.supplier})<br /></>
//       )}
//       ${order.total_price} (Balance: ${order.balance_due ?? order.total_price - (order.deposit_paid ?? 0)})
//       {order.photos?.length > 0 && (
//         <div style={{ marginTop: '10px' }}>
//           <img src={order.photos[0]} alt="Order" style={{ width: '100%', maxWidth: '150px', borderRadius: '8px' }} />
//         </div>
//       )}
//     </div>
//   );
// };

// const OrderPipeline = ({ crmData, updateCrmData }) => {
//   const [activeId, setActiveId] = useState(null);

//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: {
//         distance: 8, // Prevents drag on simple clicks
//       },
//     }),
//     useSensor(TouchSensor, {
//       activationConstraint: {
//         delay: 200,
//         tolerance: 8,
//       },
//     }),
//     useSensor(KeyboardSensor)
//   );

//   const handleDragStart = (event) => {
//     setActiveId(event.active.id);
//   };

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (!over) {
//       setActiveId(null);
//       return;
//     }

//     const activeOrderId = active.id;
//     const overId = over.id;

//     const activeOrder = crmData.orders.find((o) => o.order_id === activeOrderId);
//     if (!activeOrder) {
//       setActiveId(null);
//       return;
//     }

//     // Determine target status
//     let targetStatus = activeOrder.status;
//     if (statuses.includes(overId)) {
//       // Dropped directly on a column (empty or over the column area)
//       targetStatus = overId;
//     } else {
//       // Dropped on another order card
//       const overOrder = crmData.orders.find((o) => o.order_id === overId);
//       if (overOrder) targetStatus = overOrder.status;
//     }

//     // Only update if status actually changes
//     if (targetStatus !== activeOrder.status) {
//       const newOrders = crmData.orders.map((o) =>
//         o.order_id === activeOrderId ? { ...o, status: targetStatus } : o
//       );
//       updateCrmData({ ...crmData, orders: newOrders });
//     }

//     setActiveId(null);
//   };

//   const activeOrder = crmData.orders.find((o) => o.order_id === activeId);
//   const getClient = (client_id) => crmData.clients.find((c) => c.client_id === client_id);
//   const getFabric = (fabric_id) => crmData.fabrics?.find((f) => f.fabric_id === fabric_id);

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCorners}
//       onDragStart={handleDragStart}
//       onDragEnd={handleDragEnd}
//     >
//       <div style={{ display: 'flex', overflowX: 'auto', padding: '20px 0' }}>
//         {statuses.map((status) => {
//           const ordersInStatus = crmData.orders.filter((o) => o.status === status);

//           const { isOver, setNodeRef } = useDroppable({
//             id: status,
//           });

//           return (
//             <div
//               key={status}
//               ref={setNodeRef}
//               style={{
//                 minWidth: '340px',
//                 marginRight: '24px',
//                 backgroundColor: isOver ? '#e3f2fd' : '#f5f5f5',
//                 borderRadius: '16px',
//                 padding: '16px',
//                 transition: 'background-color 0.2s ease',
//               }}
//             >
//               <h3 style={{ textAlign: 'center', margin: '0 0 20px 0', fontSize: '18px' }}>
//                 {status} ({ordersInStatus.length})
//               </h3>

//               <SortableContext
//                 items={ordersInStatus.map((o) => o.order_id)}
//                 strategy={verticalListSortingStrategy}
//               >
//                 {ordersInStatus.map((order) => {
//                   const client = getClient(order.client_id);
//                   const fabric = getFabric(order.fabric_id);

//                   return (
//                     <SortableOrderCard
//                       key={order.order_id}
//                       order={order}
//                       client={client}
//                       fabric={fabric}
//                     />
//                   );
//                 })}
//               </SortableContext>

//               {/* Optional visual placeholder when dragging over empty column */}
//               {isOver && ordersInStatus.length === 0 && (
//                 <div style={{ height: '100px', border: '2px dashed #90caf9', borderRadius: '12px', margin: '12px 0' }} />
//               )}
//             </div>
//           );
//         })}
//       </div>

//       <DragOverlay dropAnimation={null}>
//         {activeId && activeOrder ? (
//           <div
//             className="card"
//             style={{
//               padding: '16px',
//               background: 'white',
//               borderRadius: '12px',
//               boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
//               rotate: '5deg',
//             }}
//           >
//             {(() => {
//               const client = getClient(activeOrder.client_id);
//               const fabric = getFabric(activeOrder.fabric_id);
//               return (
//                 <>
//                   <strong>{client?.first_name ?? 'Unknown'} {client?.last_name ?? ''}</strong>
//                   <br />
//                   {activeOrder.order_type}
//                   <br />
//                   {fabric?.name && <>Fabric: {fabric.name}<br /></>}
//                   ${activeOrder.total_price}
//                 </>
//               );
//             })()}
//           </div>
//         ) : null}
//       </DragOverlay>
//     </DndContext>
//   );
// };

// export default OrderPipeline;

// 2 src/OrderPipeline.jsx
// import React from 'react';
// import { DndContext, closestCenter } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
// import { v4 as uuidv4 } from 'uuid';

// const statuses = [
//   'Consultation',
//   'Fabric Selected',
//   'In Production',
//   'First Fitting',
//   'Final Fitting',
//   'Ready',
//   'Picked Up',
// ];

// const OrderPipeline = ({ crmData, updateCrmData }) => {
//   const onDragEnd = (event) => {
//     const { active, over } = event;
//     if (!over) return;

//     const activeId = active.id;
//     const overId = over.id;

//     const activeStatus = statuses.find((status) =>
//       crmData.orders.some((o) => o.order_id === activeId && o.status === status)
//     );
//     const overStatus = statuses.find((status) =>
//       crmData.orders.some((o) => o.order_id === overId && o.status === status)
//     ) || over.id; // For dropping into empty column

//     if (activeStatus === overStatus) {
//       // Reorder within same status
//       const ordersInStatus = crmData.orders.filter((o) => o.status === activeStatus);
//       const oldIndex = ordersInStatus.findIndex((o) => o.order_id === activeId);
//       const newIndex = ordersInStatus.findIndex((o) => o.order_id === overId);

//       if (oldIndex === newIndex) return;

//       const newOrdersInStatus = arrayMove(ordersInStatus, oldIndex, newIndex);
//       const updatedOrders = crmData.orders.map((o) =>
//         o.status !== activeStatus ? o : newOrdersInStatus[ordersInStatus.indexOf(o)]
//       );

//       updateCrmData({ ...crmData, orders: updatedOrders });
//     } else {
//       // Move to new status
//       const order = crmData.orders.find((o) => o.order_id === activeId);
//       if (!order) return;

//       let notification = '';
//       if (overStatus === 'First Fitting') {
//         notification = 'Client notified: First fitting scheduled.';
//       } else if (overStatus === 'Ready') {
//         notification = 'Client notified: Garment ready for pickup!';
//       }

//       const updatedOrder = { ...order, status: overStatus };
//       const updatedOrders = crmData.orders.map((o) =>
//         o.order_id === activeId ? updatedOrder : o
//       );

//       updateCrmData({ ...crmData, orders: updatedOrders });

//       if (notification) alert(notification);
//     }
//   };

//   const cloneOrder = (order) => {
//     const cloned = {
//       ...order,
//       order_id: uuidv4(),
//       status: 'Consultation',
//       deposit_paid: 0,
//       balance_due: order.total_price,
//       photos: [],
//       due_date: new Date().toISOString().split('T')[0],
//     };
//     updateCrmData({ ...crmData, orders: [...crmData.orders, cloned] });
//   };

//   return (
//     <DndContext
//       collisionDetection={closestCenter}
//       modifiers={[restrictToVerticalAxis]}
//       onDragEnd={onDragEnd}
//     >
//       <div style={{ display: 'flex', overflowX: 'auto', gap: '20px', padding: '20px 0' }}>
//         {statuses.map((status) => {
//           const ordersInStatus = crmData.orders.filter((o) => o.status === status);

//           return (
//             <div
//               key={status}
//               style={{
//                 minWidth: '320px',
//                 background: '#f8f9fa',
//                 borderRadius: '12px',
//                 padding: '16px',
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
//               }}
//             >
//               <h3 style={{ margin: '0 0 16px 0', color: '#e91e63' }}>
//                 {status} ({ordersInStatus.length})
//               </h3>

//               <SortableContext
//                 id={status}
//                 items={ordersInStatus.map((o) => o.order_id)}
//                 strategy={verticalListSortingStrategy}
//               >
//                 <div
//                   style={{
//                     minHeight: '400px',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: '12px',
//                   }}
//                 >
//                   {ordersInStatus.map((order) => (
//                     <SortableItem
//                       key={order.order_id}
//                       order={order}
//                       crmData={crmData}
//                       cloneOrder={cloneOrder}
//                     />
//                   ))}
//                 </div>
//               </SortableContext>
//             </div>
//           );
//         })}
//       </div>
//     </DndContext>
//   );
// };

// const SortableItem = ({ order, crmData, cloneOrder }) => {
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
//     useSortable({ id: order.order_id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.9 : 1,
//     background: isDragging ? '#fff8fb' : 'white',
//     border: isDragging ? '2px dashed #e91e63' : '1px solid #eee',
//     padding: '16px',
//   };

//   const client = crmData.clients.find((c) => c.client_id === order.client_id);
//   const fabric = crmData.fabrics?.find((f) => f.fabric_id === order.fabric_id);

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="card">
//       <strong>
//         {client?.first_name} {client?.last_name}
//       </strong>
//       <br />
//       <small style={{ color: '#666' }}>{order.order_type}</small>
//       {fabric && (
//         <>
//           <br />
//           <small>Fabric: {fabric.name}</small>
//         </>
//       )}
//       <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
//         ${order.total_price}
//         {order.balance_due > 0 && (
//           <span style={{ color: '#e91e63' }}> (Balance: ${order.balance_due})</span>
//         )}
//       </div>
//       {order.photos?.[0] && (
//         <img
//           src={order.photos[0]}
//           alt="Garment"
//           style={{
//             width: '100%',
//             height: '120px',
//             objectFit: 'cover',
//             borderRadius: '8px',
//             marginTop: '8px',
//           }}
//         />
//       )}
//       <button
//         onClick={() => cloneOrder(order)}
//         style={{
//           marginTop: '8px',
//           fontSize: '12px',
//           padding: '6px 10px',
//           background: '#333',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//         }}
//       >
//         Repeat Order
//       </button>
//     </div>
//   );
// };

// export default OrderPipeline;

